# Demonstrate that jq uses pass by value rather than pass by reference
# Input:    NONE
# Output:   A dictionary with keys a & b

# start with a dictrionary with one key, a, that is an array
{
    a: [1, 2, 3]
}

# update the dictionary with a new key b that is a copy of a
| .b = .a

# update a by adding a value
| .a[3] = 4