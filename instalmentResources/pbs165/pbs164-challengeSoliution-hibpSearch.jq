# Filter a HIBP breached users export down to just the users caught up in a
# breach matching a given search string.
# Input:    JSON as downloaded from the HIBP service
# Output:   An array of user-parts of email addresses
# Variables:
# - $search		The search string

# transform the lookup of breaches by AccountName into a list of entries
.Breaches | to_entries

# filter down to just the users caught up in breaches that match the search string
| [
	# explode the list of entries
	.[]

	# select only the entries for users caught up in matching breaches
	| select(any(.value[]; ascii_downcase | contains($search | ascii_downcase)))

	# keep just the user part of the email address (the key in the original lookup)
	| .key
]