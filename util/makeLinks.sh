#!/bin/bash

# Run the Python script in the docs directory

# Location of the script
ME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# assume we are in 'util'
ROOT_DIR="$( dirname "$ME_DIR" )"

cd ${ROOT_DIR}/docs
# commented out by BB 30 August 2024 — migrating main series to a Jekyll Colleciton
# ${ROOT_DIR}/util/link-maker-pbs.py
# commented out by BB 11 July 2024 — migrating tidbits to a Jekyll Colleciton
# ${ROOT_DIR}/util/link-maker-tidbit.py
