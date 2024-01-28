# Search the Nobel Prizes data set as published by the Nobel Prize Committee
# for prizes won by anyone named Curie.
# Input:    JSON as published by the Nobel Committee
# Output:   An array of prize dictionaries
[
    .prizes[]
    | select(any(.laureates[]?; "\(.firstname) \(.surname)" | contains("Curie")
    ))
]