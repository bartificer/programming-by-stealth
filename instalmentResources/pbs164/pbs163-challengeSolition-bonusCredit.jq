# Build a lookup table of Nobel Prizes by year
# Input:    JSON as published by the Nobel Committee
# Output:   a lookup-style dictionary of record-style dictionaries
#           describing Nobel Prizes indexed by years as strings

# start by grouping the prizes by year
.prizes | group_by(.year)

# build the top-level entries list
| [
    # explode the array of arrays of prizes
    .[]

    # build the top-level entries
    | {
        # use the year from the first record in the child array
        # note: aready a string in the input data
        key: .[0].year,

        # build the second-level lookup table to use as the value
        value: (
            # Note: because there is only one prize per category per year,
            # there is no need to group by anything

            # build the entries for the second-level lookup table (category)
            [
                # explode the array records
                .[]

                # build the entries
                | {
                    # use the category as the key
                    key: .category,

                    # use the entire record as the value 
                    value: .
                }
            ]

            # assemble the second-level lookup table (category)
            | from_entries
        )
    }
]

# build the top-level lookup table (year)
| from_entries