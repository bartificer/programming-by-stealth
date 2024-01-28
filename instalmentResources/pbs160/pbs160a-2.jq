# This jq script re-factors the Nobel Prizes data set as published by the Nobel
# prize committee into a simpler form.
# Input:    JSON as published by the Nobel Committee
# Output:   Simplified JSON
[
    .prizes[]
    | select((.laureates | type) == "array") # filter out un-awarded prizes
    | {
        year: (.year | tonumber),
        prize: .category,
        numWinners: (.laureates | length),
        winners: [
            .laureates[]
            | [ .firstname, .surname // empty ]
            | join(" ")
        ]
    }
]
| @json