# Sanitise the the Nobel Prizes data set as published by the Nobel Prize
# Committee to make it easier to process by normalising some existing
# fields and adding some additional ones.
# Input:    JSON as published by the Nobel Committee
# Output:   a dictionary indexed by a single key prizes containing an
#           array of dictionaries, one for each Nobel Prize
.prizes |= [
    # explode the prizes
    .[]

    # add an 'awarded' key to each prize
    | .awarded = (has("laureates"))

    # ensure all prizes have a laureates array
    | .laureates //= []

    # descend into the laureats arrays
    | .laureates |= [
        # explode the laureats
        .[]

        # add an organisation key
        | .organisation = (has("surname") | not)

        # add a displayName key
        | .displayName = ([.firstname, .surname // empty] | join(" "))
    ]
]