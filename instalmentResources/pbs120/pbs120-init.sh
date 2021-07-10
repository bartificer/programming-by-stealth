#! /bin/bash -x

repo=pbs120a
git clone $repo.bundle $repo
cd $repo
git remote remove origin