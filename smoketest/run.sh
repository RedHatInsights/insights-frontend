#!/bin/bash
export TEST_TRY_NUM=$1
time casperjs \
     --engine=phantomjs \
     --verbose \
     --log-level=debug \
     --load-images=true \
     --local-to-remote-url-access=true \
     --web-security=false --ssl-ciphers=all \
     --ssl-protocol=any \
     --ignore-ssl-errors=true \
     test smoketest/index.js

