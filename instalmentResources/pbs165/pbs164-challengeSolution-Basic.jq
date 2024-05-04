# Find users caught up in any breach that matches a given search string.
# Input:    JSON as downloaded from the HIBP service
# Output:   An array of account names (the parts of email addresses to the left of the @).
# Variables:
# - $breachSearch		The string to search breach names by un a case-insensitive way

# transform the lookup of breaches by AccountName into a list of entries:
# - keys will be account names
# - values will be arrays of breach IDs
.Breaches | to_entries

# filter down to just the users caught up in breaches matching the given search string
| [
	# explode the list of entries
	.[]

	# select only the entries for users caught up in a breach with a matching ID
	| select(any(.value[]; . | ascii_downcase | contains($breachSearch | ascii_downcase)))

	# keep just the account name
    | .key
]