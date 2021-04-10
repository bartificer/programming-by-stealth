#! /bin/bash -x

repo=pbs114a
mkdir $repo-desktop; cd $repo-desktop
git init; [ `git symbolic-ref --short HEAD` = 'master' ] && git checkout -b main
git fetch --update-head-ok ../$repo.bundle '*:*'
git checkout main
cd ../
mkdir $repo-nas.git
git init --bare $repo-nas.git
cd $repo-desktop
git remote add origin ../pbs114a-nas.git
git fetch origin
git push origin --all
git push origin --tags