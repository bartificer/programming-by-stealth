# Enrich the breach data in a domain report from the Have-I-Been-Pwned service.
# Input:    JSON as downloaded from the HIBP service
# Output:   A Lookup-style dictionary with breach data for domain users indexed
#   by email username (the part to the left of the @). For each user lookup
#   table maps to a dictionary indexed by:
#   - Breaches:         An array of dictionaries describing the breaches the
#                       user was snared in.
#   - Exposure Score:   A measure of how exposed the user is.
# Variables:
# - $breachDetails	An array containing a single entry, the JSON for the
#                   latest lookup table of HIBP breaches indexed by breach
#                   name

# Keep just the Breach details
.Breaches

# re-build the values for every key
| map_values({
    # build the enriched breach data
    Breaches: map({
        Name: .,
        Title: $breachDetails[0][.].Title,
        DataClasses: $breachDetails[0][.].DataClasses
    }),

    # calculate the exposure score
    ExposureScore: (reduce .[] as $breachName (0; 
        . + (($breachDetails[0][$breachName].DataClasses | contains(["Passwords"]) // empty | 10 ) // 1 )
    ))
})