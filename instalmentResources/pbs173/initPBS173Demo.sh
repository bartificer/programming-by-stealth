#!/usr/bin/env bash
set -x

# conditionally create the repos folder
[[ -e repos ]] || mkdir repos

# remove any old coppies of the repos
rm -rf ./repos/pbscorp-brand
rm -rf ./repos/pbscorp-app1

# clone the bundles into the repos folder
git clone ./pbscorp-brand.bundle ./repos/pbscorp-brand
git clone ./pbscorp-app1.bundle ./repos/pbscorp-app1

# update the submodules
(cd ./repos/pbscorp-app1 && git -c protocol.file.allow=always submodule update)