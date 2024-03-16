#!/usr/bin/env bash

# generate the two lookups and write them to disk
jq -f menu-byName.jq menu.json | jq -r '@json' > menu-byName.json
jq -f menu-priceByName.jq menu.json | jq -r '@json' > menu-priceByName.json