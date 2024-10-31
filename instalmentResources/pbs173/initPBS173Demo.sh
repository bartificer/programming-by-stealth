#!/usr/bin/env bash
set -x

# conditionally create the 'remote' repos folder
[[ -e remote-repos ]] || mkdir remote-repos

# remove any old copies of the 'remote' repos
rm -rf ./remote-repos/pbscorp-brand
rm -rf ./remote-repos/pbscorp-app1

# clone the bundles into the 'remote' repos folder
git clone ./pbscorp-brand.bundle ./remote-repos/pbscorp-brand
git clone ./pbscorp-app1.bundle ./remote-repos/pbscorp-app1

# update the submodules
(cd ./remote-repos/pbscorp-app1 && git -c protocol.file.allow=always submodule update)

# create the working folders used in examples
[[ -e pc-app1Dev ]] || mkdir pc-app1Dev
[[ -e pc-app2Dev ]] || mkdir pc-app2Dev