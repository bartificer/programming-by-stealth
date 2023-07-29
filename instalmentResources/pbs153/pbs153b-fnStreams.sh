#!/usr/bin/env bash

# define a POSIX function to mirror a string into a palindrome
# Arguments : NONE
# STDIN     : string
# STDOUT    : string
pal () {
    # slurp STDIN into a variable
    str=$(cat)

    # write the original string back out to STDOUT (without trailing newline)
    echo -n "$str"

    # write the reverse of the string to STDOUT
    echo "$str" | rev
}

# call the palindrome function in a pipeline
echo 'Your palindromic username: '$(echo "$USER" | pal)

# write a palindrome of the hostname in all upper case to a variable
palHost=$(hostname | pal | tr a-z A-Z)

# now print the variable in all upper case
echo "Upper Case Palindrome Hostname: $palHost"