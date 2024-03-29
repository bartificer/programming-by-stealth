# Convert a HIBP export to a list of records
# Input:    JSON as downloaded from the HIBP service
# Output:   an array of records, each indexed by AccountName and BreachNames

# start by disassembling the Breaches lookup table
.Breaches | to_entries

# transform the array of entries to an array of records
| [
    # explode the array of entries
    .[]

    # build the records
    | {
        # use the key from the entry as the account name
        AccountName: .key,

        # use the value from the entry as the list of breach names
        BreachNames: .value
    }
]