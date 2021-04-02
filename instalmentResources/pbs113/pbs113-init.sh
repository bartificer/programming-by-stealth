#! /bin/bash -x

repo=pbs113a
mkdir $repo; cd $repo
git init; [ `git symbolic-ref --short HEAD` = 'master' ] && git checkout -b main
git fetch --update-head-ok ../$repo.bundle '*:*'
git checkout main