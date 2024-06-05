# Output the number of letters in the names of the laureates who were awarded
# Nobel prizes in physics each year in the 1940s.
# Input:    The official list of Nobel Prizes in JSON format
# Output:   an array of 10 total numbers and/or strings

# filter down to just the physics prizes in the appropriate years
.prizes | map(
    (.year | tonumber) as $year
    | select($year >= 1940 and $year < 1950 and .category == "physics")

    # try calculate the number of letters in the laureate names
    | try (
        .laureates | map("\(.firstname)\(.surname)" | length) | add
    )
    # if there is an error, output a human-friendly message
    catch "No laureates in \($year)!"
)