# Build a lookup of usernames by breach name.
# Input:    A JSON export from HIBP (.Breaches is a lookup of breach names by username)
# Output:   A lookup table of usernames by breach name

# convert the breaches lookup to and array of entries
.Breaches | to_entries

# explode and re-collect the entries, expanding and reversing each
| [
    .[]

    # save the username for the current entry
    | .key as $username

    # expand the array of breaches in the current entry into multiple reversed entries
    | .value[] | {
        key: .,
        value: $username
    }
]

# group the entries by breach name, i.e. .key
| group_by(.key)

# explode and re-assemble into new grouped entries
| [
    .[]

    | {
        key: .[0].key,
        value: [ .[] | .value ]
    }
]

# build the final lookup
#| from_entries