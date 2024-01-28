# Search the Nobel Prizes data set as published by the Nobel Prize Committee
# by name and year.
# Input:    JSON as published by the Nobel Committee
# Output:   An array of prize dictionaries
# Variables:
#   $search:    The search string for matching the names
#   $minYear:   The earlist a matching prize can have been awarded (optional)
#   $maxYear:   The latest a matching prize can have been awarded (optional)
[
    .prizes[]
    | select(
        any(.laureates[]?;
            "\(.firstname) \(.surname)"
            | ascii_downcase
            | contains($search | ascii_downcase)
        )
        and (($ARGS.named | has("minYear") | not) // (.year | tonumber) >= ($ARGS.named.minYear | tonumber))
        and (($ARGS.named | has("maxYear") | not) // (.year | tonumber) <= ($ARGS.named.maxYear | tonumber))
    )
]