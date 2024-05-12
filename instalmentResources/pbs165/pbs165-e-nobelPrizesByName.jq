# Build a lookup of nobel prize years and catetories by recipient.
# Input:    The JSON data set from the Nobel Prize committee
# Output:   A lookup table mapping recipient names to arrays of dictionaries
#           indexed by year and category

# explode the prizes, transform them to entries, and re-assemble
[
    .prizes[]

    # remember the current year and category
    | .year as $year
    | .category as $category

    # explode the laureates, if there are any
    | .laureates[]?

    # build an entry for each laureate
    | {
        # pretty name logic from PBS 161 challenge solution
        key: ([.firstname, .surname // empty] | join(" ")),
        value: {
            year: $year,
            category: $category
        }
    }
]

# group the entries by name
| group_by(.key)

# explode the array of groups and collapse each into a single combined entry
| [
    .[] | {
        key: .[0].key,
        value: [ .[] | .value ]
    }
]

# assemble the entries into a lookup table
| from_entries