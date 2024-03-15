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

        # build the second-level lookup as the value
        value: (
            # start by grouping the array of records for the year by category
            group_by(.category)

            # build the entries for the second-level lookup (category)
            | [
                # explode the array of arrays of records
                .[]

                # build the entries
                | {
                    # use the category from the first record
                    key: .[0].category,

                    # there is only one prize per category per year
                    # so use the entire first record as the value 
                    value: .[0]
                }
            ]

            # assemble the second-level lookup
            | from_entries
        )
    }
]

# build the top-level lookup (year)
| from_entries