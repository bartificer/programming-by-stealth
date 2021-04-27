#! /bin/bash -x

repo=pbs115a
git clone --bare $repo.bundle $repo-nas.git
git clone $repo-nas.git $repo-desktop
git clone $repo-nas.git $repo-laptop