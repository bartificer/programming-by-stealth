# Find users caught up in any breach that leaked passwords that matches a given
# search string.
# Input:    JSON as downloaded from the HIBP service
# Output:   An array of account dictionaries describing each matching breach 
#   event. Each dictionary will be indexed by:
#   - AccountName:          The part of the email address to the left of the @
#   - BreachName:			The breach's unique name in the HIBP DB
#   - BreachTitle:          The human-friendly title of the breach
#   - BreachedDataClasses:	An array of compromised data types as strings
# Variables:
# - $breachSearch   The string to search breach names by un a case-insensitive way
# - $breachDetails	An array containing a single entry, the JSON for the
#                   latest lookup table of HIBP breaches indexed by breach
#                   name

# transform the lookup of breaches by AccountName into a list of entries:
# - keys will be account names
# - values will be arrays of breach IDs
.Breaches | to_entries

# filter down to just the users caught up in breaches matching the given search string that leaked passwords
| [
	# explode the list of entries
	.[]

	# save the current account name to a variable
	| .key as $accountName

	# explode the breach names for the current entry
	| .value[]

	# keep only the names for breaches that meet the search criteria
	| select(
		# breaches that match the search string
		(ascii_downcase | contains($breachSearch | ascii_downcase))

		# breaches with passwords
		and ($breachDetails[0][.].DataClasses | contains(["Passwords"]))
	)

	# build the dictionary to return
    | {
		AccountName: $accountName,
		BreachName: .,
		BreachTitle: $breachDetails[0][.].Title,
		BreachedDataClasses: $breachDetails[0][.].DataClasses
	}
]