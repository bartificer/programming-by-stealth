# Build a lookup of Nobel Prizes by year
# Input:    JSON as published by the Nobel Committee
# Output:   a lookup-style dictionary of record-style dictionaries
#           describing Nobel Prizes indexed by years as strings

# start by grouping the prizes by year
.prizes | group_by(.year)

# build the entries list
| [
    # explode the array of arrays of prizes
    .[]

    # build the entries
    | {
        # use the year from the first record in the child array
        # note: aready a string in the input data
        key: .[0].year,

        # use the entire child array of records as the value
        value: .
    }
]

# build the lookup
| from_entries