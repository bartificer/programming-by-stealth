#!/usr/bin/env bash

# check standard input
if [[ -t 0 ]]
then
    echo 'STDIN is a terminal' >/dev/tty
else
    echo 'STDIN is NOT a terminal' >/dev/tty
fi

# check standard output
if [[ -t 1 ]]
then
    echo 'STDOUT is a terminal' >/dev/tty
else
    echo 'STDOUT is NOT a terminal' >/dev/tty
fi

# check standard error
if [[ -t 2 ]]
then
    echo 'STDERR is a terminal' >/dev/tty
else
    echo 'STDERR is NOT a terminal' >/dev/tty
fi