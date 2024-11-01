#!/usr/bin/env bash
set -x

# conditionally create the folders representing the pretend computers, and empty them
for folder in remote-repos pc-app1Dev pc-app2Dev pc-brandDesigner
do
    [[ -e $folder ]] || mkdir $folder
    rm -rf $folder/*
done

# remove any old copies of the 'remote' repos
rm -rf ./remote-repos/pbscorp-brand
rm -rf ./remote-repos/pbscorp-app1

# clone the bundles into the 'remote' repos folder
git clone ./pbscorp-brand.bundle ./remote-repos/pbscorp-brand
git clone ./pbscorp-app1.bundle ./remote-repos/pbscorp-app1

# update the submodule in app 1
(cd ./remote-repos/pbscorp-app1 && git submodule init && git -c protocol.file.allow=always submodule update)
