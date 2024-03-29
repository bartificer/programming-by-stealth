# Build the CSV for a mail merge warning users caught up in a given breach
# Input:    JSON as downloaded from the HIBP service
# Output:   CSV data with the columns TBD
# Variables:
# - $breachName			The name of the breach to notify users about 
# - $breachDetails		An array containing a single entry, the JSON for the
#                       latest lookup table of HIBP breaches indexed by breach
#                       name


# transform the lookup of breaches by AccountName into a list of entries
.Breaches | to_entries

# filter down to just the users caught up in the given breach
| [
	# explode the list of entries
	.[]

	# select only the entries for users caught up in the given breach
	| select(any(.value[]; . == $breachName))

	# transform the remaining entries into a record for the mail merge
	| {
		# address the email to the account name (the entry key) at the domain name
		To: "\(.key)@pbs.demo",
		BreachTitle: $breachDetails[0].[$breachName].Title,
		BreachDate: $breachDetails[0].[$breachName].BreachDate,
		BreachDescriptionHTML: $breachDetails[0].[$breachName].Description,
		BreachedData: ($breachDetails[0].[$breachName].DataClasses | join(", "))
	}
]

# -- format the data as CSV --

# first output a header row
|  (["To", "BreachTitle", "BreachDate", "BreachDescriptionHTML", "BreachedData"] | @csv)

# then output the data
, (.[] | [.To, .BreachTitle, .BreachDate, .BreachDescriptionHTML, .BreachedData] | @csv)