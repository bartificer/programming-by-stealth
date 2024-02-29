# Build an alphabetically sorted list of Nobel Prize winners.
# Input:    JSON as published by the Nobel Committee
# Output:   a array of strings

# get all the laurete names
[
    # explode the prizes
    .prizes[]

    # explode the laureats
    | .laureates[]?

    # build and extract the display names
    | ([.firstname, .surname // empty] | join(" "))
]

# sort and de-duplicate the names
# (note that the unique function sorts as well as deduplicates)
| unique