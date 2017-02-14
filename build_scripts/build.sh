#!/bin/bash

set -e
source .shell_conf

echo
echo
echo "#########"
echo "# Build #"
echo "#########"

tmp_branch="tmp-`date +%s`"
git checkout -b $tmp_branch

# Get the assets directory
pushd /cache
GIT_SSL_NO_VERIFY=true git clone https://gitlab.cee.redhat.com/FlipModeSquad/insights-frontend-assets.git 2>/dev/null || true
pushd /cache/insights-frontend-assets
GIT_SSL_NO_VERIFY=true git pull
popd
popd

echo "Rsyncing data from the assets repo in /cache"
rsync -aqPS /cache/insights-frontend-assets/* --exclude 'insights-frontend-assets/.git' .

echo "gulp prod"
time gulp prod

