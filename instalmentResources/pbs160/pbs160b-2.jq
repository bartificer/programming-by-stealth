# Search the Nobel Prizes data set as published by the Nobel Prize Committee
# by name.
# Input:    JSON as published by the Nobel Committee
# Output:   An array of prize dictionaries
# Variables:
#   $search:    The search string 
[
    .prizes[]
    | select(any(.laureates[]?;
        "\(.firstname) \(.surname)"
        | ascii_downcase
        | contains($search | ascii_downcase)
    ))
]