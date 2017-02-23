#!/bin/bash
reset 2>&1 || true
time casperjs \
     --cookies-file=/tmp/cookies \
     --load-images=false \
     --local-to-remote-url-access=true \
     --web-security=false --ssl-ciphers=all \
     --ssl-protocol=any \
     --ignore-ssl-errors=true \
     test smoketest/index.js

