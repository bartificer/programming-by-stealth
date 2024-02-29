# Build an alphabetically sorted list of Nobel Prize winners.
# Human winners are sorted on surname, organisations on organisation name.
# Input:    JSON as published by the Nobel Committee
# Output:   a array of strings

# get all the lauretes
[
    # explode the prizes
    .prizes[]

    # explode the laureats
    | .laureates[]?

    # add a field to support sorting
    | .sortBy = ((select(has("surname")) | "\(.surname) \(.firstname)" ) // .firstname)

    # add a field for the name to display
    | .displayName = ([.firstname, .surname // empty] | join(" "))
]

# deduplicate first, or the sorting will get broken
| unique_by(.displayName)

# sort the array on the sortBy key
| sort_by(.sortBy)

# extract the display names
| [
    # re-explode the laureats
    .[]

    # extract just the display name
    | .displayName
]