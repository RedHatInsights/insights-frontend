#!/bin/bash
# export TEST_TRY_NUM=$1
# mkdir -p /tmp/images/${TEST_TRY_NUM}
# DEBUG='*' mocha smoketest/index.js
# DEBUG='nightmare:actions' mocha smoketest/index.js

./node_modules/nightwatch/bin/nightwatch smoketest/insightsTest.js
