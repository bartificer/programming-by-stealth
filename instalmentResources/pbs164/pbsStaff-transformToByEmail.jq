# Transform the PBS staff by username lookup table into a lookup table by email
# Input:    A lookup table of PBS staff member records by username
# Output:   A loopkup table of PBS staff member records by email

# start by converting the original lookup table to a list of entries
to_entries

# transform the entries to change the keys to email addresses
| [
    # explode the list of entries
    .[]

    # update the value of the key named key using plain assignment
    # Note: must use plain assignment so . represents the entire entry
    | .key = .value.Email
]

# assemble the updated entries into the new lookup table
| from_entries