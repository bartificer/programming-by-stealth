#!/usr/bin/env bash

# get the day of the week as a 3-letter abbreviation with the `date` command
dow=$(date '+%a')

# print the appropriate etymology
if [[ $dow = 'Mon' ]]
then
    echo 'Monday is named for the Moon'
elif [[ $dow = 'Tue' ]]
then
    echo 'Tuesday is named for the Norse god Týr'
elif [[ $dow = 'Wed' ]]
then
    echo 'Wednesday is named for the Norse god Odin'
elif [[ $dow = 'Thur' ]]
then
    echo 'Thursday is named for the Norse god Thor'
elif [[ $dow = 'Fri' ]]
then
    echo 'Friday is named for the Norse goddess Freya'
elif [[ $dow = 'Sat' ]]
then
    echo 'Saturday is named for Saturn'
elif [[ $dow = 'Sun' ]]
then
    echo 'Sunday is named for the Sun'
else
    echo 'What calendar are you on???'
fi