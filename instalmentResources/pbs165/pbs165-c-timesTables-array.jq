# Given a single number as input, output the multiplication table for that
# number as an array of strings.

# start an array
[
    # Loop over the numbers from 1 to 10
    # NOTE: the output for each iteration is the original input, 
    #       i.e. the number received by the script
    range(1; 11) as $n

    # generate the appriate row of the table
    # NOTE: the input is the number received by the script
    | "\(.) x \($n) = \(. * $n)"
]