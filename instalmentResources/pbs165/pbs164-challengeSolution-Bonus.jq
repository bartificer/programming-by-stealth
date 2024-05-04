# Find users caught up in any breach that leaked passwords that matches a given search string.
# Input:    JSON as downloaded from the HIBP service
# Output:   An array of account names (the parts of email addresses to the left of the @).
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

	# select only the entries for users caught up in a breach with a matching ID
	| select(any(.value[];
		# breaches that match the search string
		(. | ascii_downcase | contains($breachSearch | ascii_downcase))

		# breaches with passwords
		and ($breachDetails[0][.].DataClasses | contains(["Passwords"]))
	))

	# keep just the account name
    | .key
]