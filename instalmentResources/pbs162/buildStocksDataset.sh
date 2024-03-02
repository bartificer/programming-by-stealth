#!/usr/bin/env bash

# make sure there is an API key
if [[ -z "$key" ]]
then
    echo 'ERROR — export your API key as $key before running this script'
    echo 'e.g.'
    echo 'export key=YOURAPIKEY'
    exit 1
fi

# define the list of stocks to retreive
stocks=('IBM' 'MSFT' 'AAPL')

# loop over the stocks to get the individual company details
# https://www.alphavantage.co/documentation/#company-overview
for stock in "${stocks[@]}"
do
    curl -s "https://www.alphavantage.co/query?function=OVERVIEW&symbol=$stock&apikey=$key" > "techStock-$stock.json"
done

# use jq to combine the data for each company into a single JSON array
jq -nr '[inputs] | @json' techStock-*.json > techStocks.json