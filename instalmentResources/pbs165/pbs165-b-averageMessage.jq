# output the average of an array of numbers passed as input as a message of the
# form 'The average of those N numbers is X'

# store the length for later use
# NOTE - the original input is passed through
length as $numNumbers

# calculate the average
# NOTE — the input is the full array
| add/length

# assemble the message
# NOTE — the input is the average as a number
| "The average of those \($numNumbers) numbers is \(.)"