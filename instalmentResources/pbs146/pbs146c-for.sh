#!/usr/bin/env bash

#for i in ~/*
for i in $(ls ~)
do
    echo "'$i'"
done