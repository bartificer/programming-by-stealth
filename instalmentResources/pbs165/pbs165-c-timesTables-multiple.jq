# Given an array of numbers as input, output the multiplication tables for
# those numbers as an array of arrays of strings.

# start an outer array
[
    # explode the array of input numbers
    .[]

    # start an inner array for each input number
    | [
        # Loop over the numbers from 1 to 10
        # NOTE: the output for each iteration is the input number currently
        #       being processed
        range(1; 11) as $n

        # generate the appriate row of the current table
        | "\(.) x \($n) = \(. * $n)"
    ]
]