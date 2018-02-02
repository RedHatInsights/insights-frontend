# Setup
1. Make sure you `npm install`
1. Setup ./tmp/env.sh with the following in it
```
#!/bin/bash
set -a
TEST_URL=https://prod.foo.redhat.com:1337/insightsbeta
TEST_USERNAME=YOUR USER
TEST_PASSWORD=YOUR PASS
```

# Usage

## Basic usage:
$ gulp smoke:chromedriver
$ gulp smoke:run

## To run in the background
Make sure XVFB is installed, then:
$ gulp smoke:chromedriver:background
$ gulp run

## Watch
$ gulp smoke:chromedriver or gulp smoke:chromedriver:backgrond
$ gulp smoke:watch
