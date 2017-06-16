#!/bin/bash
export TEST_TRY_NUM=$1
DEBUG=nightmare:act* mocha smoketest/index.js
