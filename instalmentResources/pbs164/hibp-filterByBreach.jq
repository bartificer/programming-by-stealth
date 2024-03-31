# Filter a HIBP export down to just the accounts caught up a given breach
# Input:    JSON as downloaded from the HIBP service
# Output:   The original input with the Breaches lookup table filtered down
# Variables:
# - $breach:    The name of the breach to filter by

# update the Breaches lookup table in place
.Breaches |= (
	# start by converting the lookup table to a list of entries
	to_entries
	
	# filter the entries down to just those caught up on the Dropbox breach
	| [
		.[] | select(any(.value[]; . == $breach))
	]
	
	# re-assemble the remaining entries into a lookup table
	| from_entries
)