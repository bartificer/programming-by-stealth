# Build a lookup of menu items by name.
# Input:    A JSON array of menu item records
# Output:   A dictionary with menu item records indexed by name

# build the entries list
[
	# explode the top-level array of records
	.[]
	
	# build the entries mapping name to full record
	| {
		key: .name,
		value: . # the entire record
	}
]

# convert the entries list to a lookup
| from_entries