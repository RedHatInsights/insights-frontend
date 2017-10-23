#!/bin/bash

for var in border-radius transition box-shadow opacity transition-duration border-top-left-radius border-bottom-left-radius border-top-right-radius border-bottom-right-radius rotate transition-timing-function transition-delay transform background animation user-select background-image text-shadow
do
    echo -e "\nFixing $var"
    time perl -pe "s|\@include $var\((.*?)\)|$var: \$1|" -i `fgrep "@include $var" -r ./app/styles/ | cut -f1 -d: | sort -u | fgrep -v Bin`
    git commit -am "unprefixing $var"
done

