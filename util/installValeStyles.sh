#!/bin/bash
#
# 2021-03-21 utility script to install the Vale styles locally
# so Vale can run locally

# where is this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTDIR="$( dirname "${DIR}" )"

echo $ROOTDIR

cd "${ROOTDIR}/.github/styles"

curl -L https://github.com/errata-ai/write-good/releases/latest/download/write-good.zip -o write-good.zip
unzip -o write-good.zip

curl -L https://github.com/errata-ai/Microsoft/releases/latest/download/Microsoft.zip -o Microsoft.zip
unzip -o Microsoft.zip

curl -L https://github.com/errata-ai/proselint/releases/latest/download/proselint.zip -o proselint.zip
unzip -o proselint.zip

rm *.zip

# more style can be found at https://github.com/search?q=topic%3Avale-style+org%3Aerrata-ai&type=Repositories
