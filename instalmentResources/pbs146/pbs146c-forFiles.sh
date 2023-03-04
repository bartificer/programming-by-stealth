#!/usr/bin/env bash

echo "The files in your home dir:"
for file in ~/*
do
    echo "* $file"
done