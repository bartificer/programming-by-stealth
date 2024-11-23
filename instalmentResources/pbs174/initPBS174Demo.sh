#!/usr/bin/env bash
set -x

# conditionally create the folders representing the pretend computers, and empty them
for folder in remote-repos pc-app1Dev pc-app2Dev pc-brandDesigner
do
    [[ -e $folder ]] || mkdir $folder
    rm -rf $folder/*
done

# clone the bundles into the 'remote' repos folder
for repo in pbscorp-brand pbscorp-app1 pbscorp-app2
do
    git clone --bare "./$repo.bundle" "./remote-repos/$repo.git"
done

# clone the repos into each work's 'PC'
(cd ./pc-brandDesigner && git clone ../remote-repos/pbscorp-brand.git)
for app in app1 app2
do
    ( \
        cd "./pc-${app}Dev" && \
        git clone "../remote-repos/pbscorp-$app.git" && \
        cd "pbscorp-$app" && \
        git submodule init && \
        git -c protocol.file.allow=always submodule update
    )
done