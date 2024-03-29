# Build the CSV for a mail merge warning users caught up in the OnlinerSpambot
# breach that they have been breached
# Input:    JSON as downloaded from the HIBP service
# Output:   CSV data with the columns TBD
# Variables:
# - $breachDetails		An array containing a single entry, the JSON for the
#                       latest lookup table of HIBP breaches indexed by breach
#                       name


# transform the lookup of breaches by AccountName into a list of entries
.Breaches | to_entries

# filter down to just the users caught up in the OnlinerSpambot breach
| [
	# explode the list of entries
	.[]

	# select only the entries for users caught up in the OnlinerSpambot breach
	| select(any(.value[]; . == "OnlinerSpambot"))

	# transform the remaining entries into a record for the mail merge
	| {
		# address the email to the account name (the entry key) at the domain name
		To: "\(.key)@pbs.demo",
		BreachTitle: $breachDetails[0].OnlinerSpambot.Title,
		BreachDate: $breachDetails[0].OnlinerSpambot.BreachDate,
		BreachDescriptionHTML: $breachDetails[0].OnlinerSpambot.Description,
		BreachedData: ($breachDetails[0].OnlinerSpambot.DataClasses | join(", "))
	}
]

# -- format the data as CSV --

# first output a header row
|  (["To", "BreachTitle", "BreachDate", "BreachDescriptionHTML", "BreachedData"] | @csv)

# then output the data
, (.[] | [.To, .BreachTitle, .BreachDate, .BreachDescriptionHTML, .BreachedData] | @csv)