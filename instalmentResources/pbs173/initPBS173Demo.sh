#!/usr/bin/env bash
set -x

# conditionally create the folders representing the pretend computers, and empty them
for folder in remote-repos pc-app1Dev pc-app2Dev pc-brandDesigner
do
    [[ -e $folder ]] || mkdir $folder
    rm -rf $folder/*
done

# remove any old copies of the 'remote' repos
for repo in pbscorp-brand pbscorp-app1 pbscorp-app2
do
    rm -rf "./remote-repos/$repo"
done

# clone the bundles into the 'remote' repos folder
git clone --bare ./pbscorp-brand.bundle ./remote-repos/pbscorp-brand.git
git clone --bare ./pbscorp-app1.bundle ./remote-repos/pbscorp-app1.git

# create an empty 'remote' for app 2
(cd ./remote-repos/ && git init --bare pbscorp-app2.git)

# clone the brand repo into the brand designer's 'PC'
(cd ./pc-brandDesigner && git clone ../remote-repos/pbscorp-brand.git)