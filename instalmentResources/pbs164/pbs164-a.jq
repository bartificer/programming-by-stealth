# Filter a HIBP export down to just the accounts caught up in the
# Dropbox breach
# Input:    JSON as downloaded from the HIBP service
# Output:   The original input with the Breaches lookup table filtered down

# update the Breaches lookup table in place
.Breaches |= (
	# start by converting the lookup table to a list of entries
	to_entries
	
	# filter the entries down to just those caught up on the Dropbox breach
	| [
		.[] | select(any(.value[]; . == "Dropbox"))
	]
	
	# re-assemble the remaining entries into a lookup table
	| from_entries
)