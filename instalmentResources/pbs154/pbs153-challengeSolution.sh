#!/usr/bin/env bash

# Exit codes:
# 1: missing required args or unsupported flags or optional args
# 2: invalid value for supported arg

#
# === set defaults ===
#
start=1    # default to starting at 1
end=10     # default to ending at 10
doDebug='' # default to not debugging

#
# === Define Helper Functions ===
#

# test if the first argument is an integer
# Arguments   : NONE
# STDIN       : value to test
# STDOUT      : NOTHING
# Return Codes:
#   0 - the value is an integer
#   1 - the value is not an integer
is_int () {
    echo "$1" | egrep -q '^[-]?\d+$' && return 0
    return 1
}

#
# === process args ===
#

# utility variables
usage="Usage: $(basename $0) [-s START] [-e END] [-d] N"

# process optional args & flags
while getopts ':s:e:d' opt
do
    case $opt in
        s)  
            if is_int $OPTARG
            then
                start=$OPTARG
            else
                echo "invalid starting value '$OPTARG', must be a whole number" >&2
                echo "$usage" >&2
                exit 2
            fi
            ;;
        e)
            if is_int $OPTARG
            then
                end=$OPTARG
            else
                echo "invalid ending value '$OPTARG', must be a whole number" >&2
                echo "$usage" >&2
                exit 2
            fi
            ;;
        d)
            doDebug=1
            ;;
        ?)
            echo "$usage" >&2
            exit 1
            ;;
    esac
done
shift $(( OPTIND - 1 ))

# process positional arg
n=$1
if [[ -z $n ]] # no first real arg
then
    echo "$usage" >&2
    exit 1
fi
if ! is_int "$n" # invalid first real arg
then
    echo "invalid number '$n' first argument must be a whole number" >&2
    exit 2
fi

# if debugging, print values
if [[ -n $doDebug ]]
then
    echo "DEBUG: n       = $n" >&2
    echo "DEBUG: start   = $start" >&2
    echo "DEBUG: end     = $end" >&2
fi

#
# === Build row format string ===
#

# calculate maximum lengths for each column when nicely formatted
nLen=$(printf "%'d" $n | wc -c | xargs) # character length of the number when formatted
maxMLen=1 # maximum character length of any formatted multiplier
maxPLen=1 # maximum character length of any formatted product
for m in $(seq $start $end)
do
    # Multiplier length when nicely formatted
    mLen=$(printf "%'d" $m | wc -c | xargs)
    [[ $mLen -gt $maxMLen ]] && maxMLen=$mLen

    # Product length when nicely formatted
    pLen=$(echo $(( n * m )) | xargs printf "%'d" | wc -c | xargs)
    [[ $pLen -gt $maxPLen ]] && maxPLen=$pLen
done

# calculate the length of the middle piece of the table caps
capLen=$(( 8 + nLen + maxMLen + maxPLen ))

# if debugging, print the calculated numbers
if [[ -n $doDebug ]]
then
    echo "DEBUG: nLen    = $nLen" >&2
    echo "DEBUG: maxMLen = $maxMLen" >&2
    echo "DEBUG: maxPLen = $maxPLen" >&2
    echo "DEBUG: capLen  = $capLen" >&2
fi

# build the row format string, and print if debugging
fString="┃ %'"$nLen"d x %'"$maxMLen"d = %'"$maxPLen"d ┃\n"
[[ -n $doDebug ]] && echo "DEBUG: fString = $fString" >&2

# build the cap insert, and print if debugging
capMid=''; for c in $(seq 1 $capLen); do capMid+='━'; done
[[ -n $doDebug ]] && echo "DEBUG: capMid  = $capMid" >&2

#
# === print the table ===
#

# the variable to build the table into
table=''

# render the top cap row
printf -v row '┏%s┓\n' $capMid
table+=$row

# print the table body
for m in $(seq $start $end)
do
    # calculate the product
    p=$(( n * m ))

    # render the table row
    printf -v row "$fString" $n $m $p
    table+=$row
done

# render the bottom cap row
printf -v row '┗%s┛\n' $capMid
table+=$row

# print the table
if [[ -t 1 ]]
then
    echo "$table" | less --no-init --quit-if-one-screen
else
    echo "$table"
fi