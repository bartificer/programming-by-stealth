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
    If specified, suppresses output to the console except for errors and warnings.
	
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
    Invoke the simulation 5,000 times, write the human-friendly output to the console, and suppress the outputted datastructure:

    PS> ./Invoke-MontyHallSimulation -Count 5000 | Out-Null

.EXAMPLE
    Invoke the simulation 5,000 times and suppress the human output and just output the datastructure:
    
    PS> ./Invoke-MontyHallSimulation -Count 5000 -Quiet
#>
[CmdletBinding()]
param(
    [Parameter(ValueFromPipeline=$true, Position=0)]
    [ValidateRange(1, [int]::MaxValue)]
    [int]$Count = 1000,
    [switch]$Quiet = $false
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
        The number of random numbers to retreive, must greater than or equal to 1 and defaults to 10.
    
    .PARAMETER Minimum
        The minimum value of the random numbers, defaults to 1.

    .PARAMETER Maximum
        The maximum value of the random numbers, must be greater than the Minimum value and defaults to 10.
	
    .INPUTS
        None.
	
    .OUTPUTS
        System.Int32[]. An array of random integers in the specified range.
    #>
    function Get-RandomDotOrgIntegers {
        [CmdletBinding()]
        param (
            [Parameter(Position=0)]
            [Alias('n')]
            [ValidateRange(1, [int]::MaxValue)]
            [int]$Count = 10,

            [Alias('min')]
            [int]$Minimum = 1,

            [Alias('max')]
            [int]$Maximum = 10
        )

        # Validate the parameters
        if ($Maximum -le $Minimum) {
            throw "Maximum value ($Maximum) must be greater than Minimum value ($Minimum)."
        }
        
        # build the URI for the random.org API
        $RandomDotOrgUri = "https://www.random.org/integers/?num=$Count&min=$Minimum&max=$Maximum&col=1&base=10&format=plain&rnd=new"
        Write-Verbose "Requesting $Count random numbers between $Minimum and $Maximum from random.org using the URI: $RandomDotOrgUri"

        # get the random numbers from random.org
        $RandomNumbersRawString = Invoke-WebRequest -Uri $RandomDotOrgUri -Method Get -ErrorAction Stop | Select-Object -ExpandProperty Content
        $RandomNumbers = $RandomNumbersRawString.Trim() -split "`r?`n" # clean off any trailing newlines and split on newlines in a way that works cross-platform
        Write-Verbose "Got $($RandomNumbers.Count) random numbers between $Minimum and $Maximum from random.org"

        # return the random numbers
        Write-Output $RandomNumbers
    }

    <#
    .SYNOPSIS
        Initialize the random number cache that will be used to run the simulation.

    .DESCRIPTION
        Use the Radom.org API to initialise a cache with the random random numbers needed to run the simulation.
        
        What is needed is:
        1. Twice as many random numbers between one and three (inclusive) as there are games to be played.
        2. Twice as many random numbers between one and two (inclusive) as there are games to be played.

        The random numbers are stored in the script scope as enumerators which power the `Get-Random1to3`, `Get-Random1to2` and `Get-RandomBoolean` functions.
	
    .INPUTS
        None.
	
    .OUTPUTS
        None.
    #>
    function Initialize-RandomNumberCache {
        [CmdletBinding()]
        param (
            [Parameter(Mandatory=$true)]
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
    # Get the needed random numbers and convert them to enumerators
    $NumRandomNumbersNeeded = $Count * 2
    Initialize-RandomNumberCache -Count $NumRandomNumbersNeeded

    # stats counters for the three strategies
    $GamesPlayed = 0
    $StickWins = 0
    $SwitchWins = 0
    $RandomWins = 0

    # Play the game!
    foreach ($GameNumber in 1..$Count) {
        if (-not $Quiet) { Write-Host "`nGame $($GameNumber.ToString('n0')) of $($Count.ToString('n0'))" -ForegroundColor DarkGreen }

        # Randomly choose a door to hide the car behind
        $CarDoor = Get-Random1to3

        # Make an initial guess
        $GuessDoor = Get-Random1to3
        if (-not $Quiet) { Write-Host "You choose door $GuessDoor (🚗🚪$CarDoor)" -ForegroundColor DarkGray }

        # Determine which door Monty will open (not the car door or the guessed door)
        $RemainingDoors = 1..3 | Where-Object { $_ -ne $CarDoor -and $_ -ne $GuessDoor }
        Write-Verbose "The remaing doors for Monty to open door are: $($RemainingDoors -join ', ')"
        $MontyDoor = if( $RemainingDoors.Count -eq 1 ) { $RemainingDoors[0] } else { $RemainingDoors[(Get-Random1to2) - 1] }
        if (-not $Quiet) { Write-Host "Monty opens door $MontyDoor"  -ForegroundColor DarkGray }

        if (-not $Quiet) { Write-Host "Results:" }
        $StickWon = $false
        $SwitchWon = $false

        # Strategty 1: Stick with the original guess
        if ($GuessDoor -eq $CarDoor) {
            if (-not $Quiet) { Write-Host " - Stick Strategy: you won 🎉" -ForegroundColor Green }
            $StickWon = $true
            $StickWins++
        } else {
            if (-not $Quiet) { Write-Host " - Stick Strategy you lost 😢" -ForegroundColor Red }
        }

        # Stragety 2: Switch to the other door
        $SwitchDoor = (1..3 | Where-Object { $_ -ne $GuessDoor -and $_ -ne $MontyDoor })[0]
        if ($SwitchDoor -eq $CarDoor) {
            if (-not $Quiet) { Write-Host " - Switch Strategy: you won 🎉 (🚪$SwitchDoor)" -ForegroundColor Green }
            $SwitchWon = $true
            $SwitchWins++
        } else {
            if (-not $Quiet) { Write-Host " - Switch Strategy: you lost 😢" -ForegroundColor Red }
        }

        # Strategy 3: Randomly decide to switch or stick
        $RanomlySwitch = Get-RandomBoolean
        if ($RanomlySwitch) {
            if ($SwitchWon) {
                if (-not $Quiet) { Write-Host " - Random Strategy: you won 🎉 (🚪$SwitchDoor)" -ForegroundColor Green }
                $RandomWins++
            } else {
                if (-not $Quiet) { Write-Host " - Random Strategy: you lost 😢 (🚪$SwitchDoor)" -ForegroundColor Red }
            }
        } else {
            if ($StickWon) {
                if (-not $Quiet) { Write-Host " - Random Strategy: you won 🎉 (🚪$GuessDoor)" -ForegroundColor Green }
                $RandomWins++
            } else {
                if (-not $Quiet) { Write-Host " - Random Strategy: you lost 😢 (🚪$GuessDoor)" -ForegroundColor Red }
            }
        }
        
        # Increment the games played counter
        $GamesPlayed++
    }

    # calculate the percentage of wins for each strategy
    $StickWinPercentage = if ($GamesPlayed -gt 0) { [math]::Round(($StickWins / $GamesPlayed) * 100, 2) } else { 0 }
    $SwitchWinPercentage = if ($GamesPlayed -gt 0) { [math]::Round(($SwitchWins / $GamesPlayed) * 100, 2) } else { 0 }
    $RandomWinPercentage = if ($GamesPlayed -gt 0) { [math]::Round(($RandomWins / $GamesPlayed) * 100, 2) } else { 0 }

    # write the final results
    if (-not $Quiet) {
        Write-Host "`nFinal Results:" -ForegroundColor DarkGreen
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
}