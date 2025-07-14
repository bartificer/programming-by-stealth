#Requires -version 7.5
<#
.SYNOPSIS
    Run the Monty Hall Problem to compare the effect of different strategies.

.DESCRIPTION
    Run the famous Monty Hall Problem multiple times with three different strategies to compare their effectiveness:
    
    1. Always stick with your original guess.
    2. Always switch to the other door after one is revealed.
    3. Randomly choose to switch or stick with the original guess.
	
.PARAMETER Count
    The number of times to run the simulation, defaults to 1000.

.PARAMETER Quiet
    If specified, suppresses output describing each game to the console. Ignored if -Verbose is specified, and has no effect if -Silent is specified.

.PARAMETER Silent
    If specified, suppresses all console output other than errors and warnings. Ignored if -Verbose is specified, and supercedes -Quiet.
	
.INPUTS
    System.Int32. The number of times to run the simulation.
	
.OUTPUTS
    [PSCustomObject] with properties: 
        - GamesPlayed: The total number of games played.
        - StickWins: The number of wins using the stick strategy.
        - SwitchWins: The number of wins using the switch strategy.
        - RandomWins: The number of wins using the random strategy.
        - StickWinPercentage: The percentage of wins using the stick strategy.
        - SwitchWinPercentage: The percentage of wins using the switch strategy.
        - RandomWinPercentage: The percentage of wins using the random strategy.
	

.EXAMPLE
    Run a simulation with all the default parameters. This will play the game 1,0000 time, show each game happening on
    the console, write a human-friendly summary to the console, and output the results as a custom object:

    PS> & ./Invoke-MontyHallSimulation.ps1
.EXAMPLE
    Invoke the simulation 5,000 times and only show the human-friendly summary on the console:

    PS> & ./Invoke-MontyHallSimulation.ps1 -Count 5000 -Quiet | Out-Null

.EXAMPLE
    Invoke the simulation 5,000 times, suppress all console output and convert the resuts data structure to JSON:
    
    PS> & ./Invoke-MontyHallSimulation.ps1 -Count 5000 -Silent | ConvertTo-Json
#>
[CmdletBinding()]
param(
    [Parameter(ValueFromPipeline=$true, Position=0)]
    [ValidateRange(1, 5000)] # Allow up to half of Random.org's limit since we need twice that many random numbers of each type
    [int]$Count = 1000,
    [switch]$Quiet = $false,
    [switch]$Silent = $false
)
begin {
    #region Global Variables

    # Define the variables for handling the random numbers
    $Random1to2 # An enumerator for random numbers between 1 and 2
    $Random1to3 # An enumerator for random numbers between 1 and 3

    #endregion

    #region Helper Functions

    <#
    .SYNOPSIS
        Get random integers in a given range from Random.org.

    .DESCRIPTION
        Use the Radom.org API to retrieve a given number of random integers in a specified range.
	
    .PARAMETER Count
        The number of random numbers to retreive, must greater than or equal to 1.
    
    .PARAMETER Minimum
        The minimum value of the random numbers.

    .PARAMETER Maximum
        The maximum value of the random numbers.
	
    .INPUTS
        None.
	
    .OUTPUTS
        System.Int32[]. An array of random integers in the specified range.
    #>
    function Get-RandomDotOrgIntegers {
        [CmdletBinding()]
        param (
            [Parameter(Mandatory=$true, Position=0)]
            [Alias('n')]
            [ValidateRange(1, 10000)] # maximum allowed by Random.org
            [int]$Count,

            [Parameter(Mandatory=$true, Position=1)]
            [Alias('min')]
            [int]$Minimum,

            [Parameter(Mandatory=$true, Position=2)]
            [Alias('max')]
            [int]$Maximum
        )

        # Validate the parameters
        if ($Maximum -le $Minimum) {
            throw "Maximum value ($Maximum) must be greater than Minimum value ($Minimum)."
        }
        
        # build the URI for the random.org API
        $RandomDotOrgUri = "https://www.random.org/integers/?num=$Count&min=$Minimum&max=$Maximum&col=1&base=10&format=plain&rnd=new"
        Write-Verbose "Requesting $Count random numbers between $Minimum and $Maximum from random.org using the URI: $RandomDotOrgUri"

        # get the random numbers from random.org
        $RandomNumbersRawString = ''
        try {
            $RandomNumbersRawString = Invoke-WebRequest -Uri $RandomDotOrgUri -Method Get | Select-Object -ExpandProperty Content
        } catch {
            Write-Error "Failed to retrieve random numbers from Random.org with error: '$_'" -ErrorAction Stop
        }
        $RandomNumbers = $RandomNumbersRawString.Trim() -split "`r?`n" # clean off any trailing newlines and split on newlines in a way that works cross-platform
        Write-Verbose "Got $($RandomNumbers.Count) random numbers between $Minimum and $Maximum from random.org"

        # return the random numbers
        Write-Output $RandomNumbers
    }

    <#
    .SYNOPSIS
        Initialize the random number cache.

    .DESCRIPTION
        Use the Radom.org API to initialise a cache with the random random numbers needed to run the simulation.
        
        Because there are equal numbers of random numbers needed in the one-to-two and one-to-three ranges, only one count needs to be passed.

        The random numbers are stored in the script scope as enumerators which power the `Get-Random1to3`, `Get-Random1to2` and `Get-RandomBoolean` functions.
    
    .PARAMETER Count
        The number of random numbers (in each range) to retrieve from Random.org, must be greater than or equal to 1.
	
    .INPUTS
        System.Int32[]. The number of random numbers (in each range) to retrieve from Random.org, must be greater than or equal to 1.
	
    .OUTPUTS
        None.
    #>
    function Initialize-RandomNumberCache {
        [CmdletBinding()]
        param (
            [Parameter(Mandatory=$true, Position=0)]
            [ValidateRange(1, [int]::MaxValue)]
            [int]$Count
        )

        # Initialize the random number enumerators
        $Random1to2List = Get-RandomDotOrgIntegers -Count $Count -Minimum 1 -Maximum 2
        $script:Random1to2 = $Random1to2List.GetEnumerator()
        $Random1to3List = Get-RandomDotOrgIntegers -Count $Count -Minimum 1 -Maximum 3
        $script:Random1to3 = $Random1to3List.GetEnumerator()
        Write-Verbose "Initialized random number cache with $Count random numbers between 1 and 2, and $Count random numbers between 1 and 3."
    }

    <#
    .SYNOPSIS
        Get a 1 or a 2 at random.

    .DESCRIPTION
        Return the next cached random integer in the one-to-two range.
	
    .INPUTS
        None.
	
    .OUTPUTS
        System.Int32. A random number between 1 and 2 (inclusive).
    #>
    function Get-Random1to2 {
        [CmdletBinding()]
        param ()

        # Get the next random number from the enumerator
        if ($Random1to2.MoveNext()) {
            return $Random1to2.Current
        } else {
            throw "No more random numbers available in the enumerator."
        }
    }

    <#
    .SYNOPSIS
        Get a random Boolean value.

    .DESCRIPTION
        Using the cached random integers in the one-to-two ranges, returns `$true` if the next random integer is 2, otherwise, returns `$false`.
	
    .INPUTS
        None.
	
    .OUTPUTS
        System.Boolean.
    #>
    function Get-RandomBoolean {
        [CmdletBinding()]
        param ()

        # Get the next random number from the enumerator
        if ($Random1to2.MoveNext()) {
            return $Random1to2.Current -eq 2 # returns true for 2, false for 1
        } else {
            throw "No more random numbers available in the enumerator."
        }
    }

    <#
    .SYNOPSIS
        Get a random integer between 1 and 3 (inclusive).

    .DESCRIPTION
        Return the next cached random integer in the one-to-three range.
	
    .INPUTS
        None.
	
    .OUTPUTS
        System.Int32. A random number between 1 and 3 (inclusive).
    #>
    function Get-Random1to3 {
        [CmdletBinding()]
        param ()

        # Get the next random number from the enumerator
        if ($Random1to3.MoveNext()) {
            return $Random1to3.Current
        } else {
            throw "No more random numbers available in the enumerator."
        }
    }

    #endregion
}
process {
    #region Parameter Validation

    # Figure out what console outputs to send
    $DoShowResults = -not $Silent
    $DoShowGameDetail = -not ($Quiet -or $Silent)
    if ($VerbosePreference -ne 'SilentlyContinue') {
        $DoShowResults = $true
        $DoShowGameDetail = $true
        Write-Verbose "Verbose mode is enabled, so forcing all console outputs."
    } else {
        
    }

    #endregion

    #region Run the Simulation

    # Initialise the random number cache with twice the number of games to be played
    # Note: each run of the game needs up to two of each type of random number:
    # 1. A number from 1 to 3 for the door to randomly hide the car behind
    # 2. A number from 1 to 3 for the initial guess
    # 3. If your initial guess is correct, a number from 1 to 2 for the door Monty opens
    # 4. A number from 1 to 2 to randomly decide whether to switch or stick when using the random strategy
    $NumRandomNumbersNeeded = $Count * 2
    Initialize-RandomNumberCache -Count $NumRandomNumbersNeeded

    # stats counters for the three strategies
    $GamesPlayed = 0
    $StickWins = 0
    $SwitchWins = 0
    $RandomWins = 0

    # Play the game!
    foreach ($GameNumber in 1..$Count) {
        if ($DoShowGameDetail) { Write-Host "`nGame $($GameNumber.ToString('n0')) of $($Count.ToString('n0')):" -ForegroundColor DarkMagenta }

        # Randomly choose a door to hide the car behind
        $CarDoor = Get-Random1to3

        # Make an initial guess
        $GuessDoor = Get-Random1to3
        if ($DoShowGameDetail) { Write-Host "You choose door $GuessDoor (🚗🚪$CarDoor)" -ForegroundColor DarkGray }

        # Determine which door Monty will open (not the car door or the guessed door)
        $RemainingDoors = 1..3 | Where-Object { $_ -ne $CarDoor -and $_ -ne $GuessDoor }
        Write-Verbose "The remaing doors for Monty to open door are: $($RemainingDoors -join ', ')"
        $MontyDoor = if( $RemainingDoors.Count -eq 1 ) { $RemainingDoors[0] } else { $RemainingDoors[(Get-Random1to2) - 1] }
        if ($DoShowGameDetail) { Write-Host "Monty opens door $MontyDoor"  -ForegroundColor DarkGray }

        if ($DoShowGameDetail) { Write-Host "Results:" }
        $StickWon = $false
        $SwitchWon = $false

        # Strategty 1: Stick with the original guess
        if ($GuessDoor -eq $CarDoor) {
            if ($DoShowGameDetail) { Write-Host " - Stick Strategy: you won 🎉" -ForegroundColor Green }
            $StickWon = $true
            $StickWins++
        } else {
            if ($DoShowGameDetail) { Write-Host " - Stick Strategy you lost 😢" -ForegroundColor Red }
        }

        # Stragety 2: Switch to the other door
        $SwitchDoor = (1..3 | Where-Object { $_ -ne $GuessDoor -and $_ -ne $MontyDoor })[0]
        if ($SwitchDoor -eq $CarDoor) {
            if ($DoShowGameDetail) { Write-Host " - Switch Strategy: you won 🎉 (🚪$SwitchDoor)" -ForegroundColor Green }
            $SwitchWon = $true
            $SwitchWins++
        } else {
            if ($DoShowGameDetail) { Write-Host " - Switch Strategy: you lost 😢" -ForegroundColor Red }
        }

        # Strategy 3: Randomly decide to switch or stick
        $RanomlySwitch = Get-RandomBoolean
        if ($RanomlySwitch) {
            if ($SwitchWon) {
                if ($DoShowGameDetail) { Write-Host " - Random Strategy: you won 🎉 (🚪$SwitchDoor)" -ForegroundColor Green }
                $RandomWins++
            } else {
                if ($DoShowGameDetail) { Write-Host " - Random Strategy: you lost 😢 (🚪$SwitchDoor)" -ForegroundColor Red }
            }
        } else {
            if ($StickWon) {
                if ($DoShowGameDetail) { Write-Host " - Random Strategy: you won 🎉 (🚪$GuessDoor)" -ForegroundColor Green }
                $RandomWins++
            } else {
                if ($DoShowGameDetail) { Write-Host " - Random Strategy: you lost 😢 (🚪$GuessDoor)" -ForegroundColor Red }
            }
        }
        
        # Increment the games played counter
        $GamesPlayed++
    }

    # calculate the percentage of wins for each strategy
    $StickWinPercentage = if ($GamesPlayed -gt 0) { [math]::Round(($StickWins / $GamesPlayed) * 100, 2) } else { 0 }
    $SwitchWinPercentage = if ($GamesPlayed -gt 0) { [math]::Round(($SwitchWins / $GamesPlayed) * 100, 2) } else { 0 }
    $RandomWinPercentage = if ($GamesPlayed -gt 0) { [math]::Round(($RandomWins / $GamesPlayed) * 100, 2) } else { 0 }

    #endregion

    #region Output the Results

    # write the final results
    if ($DoShowResults) {
        Write-Host "`nFinal Results:" -ForegroundColor DarkMagenta
        Write-Host " - Games Played: $($GamesPlayed.ToString('n0'))"
        Write-Host " - Stick Strategy: $($StickWins.ToString('n0')) Wins ($StickWinPercentage%)"
        Write-Host " - Switch Strategy: $($SwitchWins.ToString('n0')) Wins ($SwitchWinPercentage%)"
        Write-Host " - Random Strategy: $($RandomWins.ToString('n0')) Wins ($RandomWinPercentage%)"
    }

    # Output the results as a custom object
    $Results = [PSCustomObject]@{
        GamesPlayed = $GamesPlayed
        StickWins = $StickWins
        SwitchWins = $SwitchWins
        RandomWins = $RandomWins
        StickWinPercentage = $StickWinPercentage
        SwitchWinPercentage = $SwitchWinPercentage
        RandomWinPercentage = $RandomWinPercentage
    }
    Write-Output $Results

    #endregion
}