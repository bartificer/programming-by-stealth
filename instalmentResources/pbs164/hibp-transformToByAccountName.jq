# Transform a HIBP Export into a lookup by breach name
# Input:    JSON as downloaded from the HIBP service
# Output:   The original input with the Breaches lookup table
#           changed to be arrays of user accounts indexed by
#           breach name

# update the Breaches lookup table in place
.Breaches |= (
	# start by converting the lookup table to a list of entries
	to_entries
	
	# build a list of records for all breach-user combinations
	| [
		# explode the original entries
		.[]

		# save the account name
		| .key as $accountName

		# explode the breaches for each user
		| .value[]

		# build a record for each breach
		| {
			BreachName: .,
			AccountName: $accountName
		}
	]

	# group the breach records by breach name
	| group_by(.BreachName)

	# transform the groups of breach records into a list of entries
	| [
		# explode the array of arrays of records
		.[]

		# build an entry from the array of records
		| {
			# use the first record's breach name as the key
			key: .[0].BreachName,

			# build an array of account names as the value
			value: [ .[] | .AccountName ]
		}
	]

	# assemble the entries into a lookup table
	| from_entries
)