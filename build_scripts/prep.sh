#!/bin/bash

set -e

echo "
STASHED_HEAD=`git rev-parse --verify HEAD`
" > .shell_conf

source .shell_conf

echo
echo
echo "############################################"
echo "# $STASHED_HEAD #"
echo "############################################"

function setup_caches {
	echo "Setting up caches in `pwd`"
	depsHash=`cat package.json | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["dependencies"];print obj["devDependencies"]' | md5sum | awk '{print $1}'`
    cache="/cache/npm/app/$depsHash"
	echo "npm app cache dir: $cache"
	mkdir -p "$cache"
    rm -rf ./node_modules && mkdir ./node_modules
	sudo mount -o bind $cache ./node_modules

    cache="/cache/npm/home/$depsHash"
	echo "npm home cache dir: $cache"
	mkdir -p "$cache"
    rm -rf ~/.npm
    ln -s $cache ~/.npm


	depsHash=`cat bower.json | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["dependencies"];print obj["resolutions"]' | md5sum | awk '{print $1}'`
	cache="/cache/bower/$depsHash"
	echo "bower cache dir: $cache"
	mkdir -p "$cache"
    rm -rf ./app/bower_components
    ln -s $cache ./app/bower_components

    depsHash=`cat Gemfile.lock | md5sum | awk '{print $1}'`
	cache="/cache/gems/$depsHash"
	echo "gem cache dir: $cache"
	mkdir -p "$cache"
    rm -rf ~/.gem
    ln -s $cache ~/.gem
}

setup_caches

# disable guppy
sed -s 's/^.*guppy.*$//g' -i package.json
rm -rf gulp/tasks/guppy.js

# npm speed opts
npm set progress=false

npm install --cache-min 14400 --loglevel error &  PIDNPM=$!
bundle install &  PIDBUNDLE=$!
bower install --quiet &  PIDBOWER=$!
wait $PIDNPM
wait $PIDBUNDLE
wait $PIDBOWER

