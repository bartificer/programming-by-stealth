# Build a lookup of prices by menu item name.
# Input:    A JSON array of menu item records
# Output:   A dictionary with prices indexed by item names

# build the entries list
[
	# explode the top-level array of records
	.[]
	
	# build the entries mapping name to price
	| {
		key: .name,
		value: .price
	}
]

# convert the entries list to a lookup
| from_entries