# implied else
5 | if . < 0 then . + 10 end
# results in 5

# equivalent explicit else
,5 | if . < 0 then . + 10 else . end
# results in 5