#!/usr/bin/env bash
set -x

# clone the repos into the sysadmin's 'PC'
( \
    cd ./pc-sysadmin && \
    git clone ../remote-repos/pbscorp-brand.git
)
for app in app1 app2
do
    ( \
        cd ./pc-sysadmin && \
        git clone "../remote-repos/pbscorp-$app.git" && \
        cd "pbscorp-$app" && \
        git submodule init && \
        git -c protocol.file.allow=always submodule update
    )
done

# create the new branches on the brand repo
( \
    cd ./pc-sysadmin/brand && \
    git branch stable-v1 && \
    git push --set-upstream origin stable-v1 && \
    git branch stable-v2 && \
    git push --set-upstream origin stable-v2
)

# LEFT OFF HERE!!!