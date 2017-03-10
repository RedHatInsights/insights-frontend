#!/bin/bash
export TEST_TRY_NUM=$1
time casperjs \
     --load-images=true \
     --local-to-remote-url-access=true \
     --web-security=false --ssl-ciphers=all \
     --ssl-protocol=any \
     --ignore-ssl-errors=true \
     test smoketest/index.js

