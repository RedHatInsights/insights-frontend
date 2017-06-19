#!/bin/bash
export TEST_TRY_NUM=$1
# DEBUG='*' mocha smoketest/index.js
DEBUG='nightmare:actions' mocha smoketest/index.js
