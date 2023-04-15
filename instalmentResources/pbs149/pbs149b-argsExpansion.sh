#!/usr/bin/env bash

echo "You passed $# args"
echo ''
echo 'Un-quoted $* expands them to:'
for a in $*
do
    echo "* $a"
done
echo ''
echo 'Un-quoted $@ expands them to:'
for a in $@
do
    echo "* $a"
done
echo ''
echo 'Quoted $* expands them to:'
for a in "$*"
do
    echo "* $a"
done
echo ''
echo 'Quoted $@ expands them to:'
for a in "$@"
do
    echo "* $a"
done