#!/usr/bin/env bash

# get the day of the week as a 3-letter abbreviation with the `date` command
dow=$(date '+%a')

# print the appropriate etymology
case $dow in
    Mon )
        echo 'Monday is named for the Moon'
        ;;
    Tue )
        echo 'Tuesday is named for the Norse god Týr'
        ;;
    Wed )
        echo 'Wednesday is named for the Norse god Odin'
        ;;
    Thur )
        echo 'Thursday is named for the Norse god Thor'
        ;;
    Fri )
        echo 'Saturday is named for the Norse goddess Freya'
        ;;
    Sat )
        echo 'Saturday is named for Saturn'
        ;;
    Sun )
        echo 'Sunday is named for the Sun'
        ;;
    * )
    echo 'What calendar are you on???'
esac