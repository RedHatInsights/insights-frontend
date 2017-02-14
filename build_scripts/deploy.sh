#!/bin/bash

set -e
source .shell_conf

echo
echo
echo "##########"
echo "# Deploy #"
echo "##########"

case $GIT_BRANCH in
	"origin/master")
        GEAR_NAME="insightsbeta-labsdev"
        GEAR_USER_URL="56a91f455110e2200d0003ee@insightsbeta-labsdev.itos.redhat.com"
        TARGET_REPO="ssh://$GEAR_USER_URL/~/git/insightsbeta.git/"
        ;;
    "origin/beta-prod")
        GEAR_NAME="insightsbeta-labsprod"
        GEAR_USER_URL="56aa63abecdd5c07be00001c@insightsbeta-labsprod.itos.redhat.com"
        TARGET_REPO="ssh://$GEAR_USER_URL/~/git/insightsbeta.git/"
        ;;
    "origin/stable-4.6")
        GEAR_NAME="insights-labsdev"
        GEAR_USER_URL="54e41b343b696e7964000356@insights-labsdev.itos.redhat.com"
        TARGET_REPO="ssh://$GEAR_USER_URL/~/git/insights.git/"
        ;;
    "origin/prod")
        GEAR_NAME="insights-labsprod"
        GEAR_USER_URL="558412a6ecdd5c78cc00013f@insights-labsprod.itos.redhat.com"
        TARGET_REPO="ssh://$GEAR_USER_URL/~/git/insights.git/"
        ;;
    *)
        echo "Branch $BRANCH_NAME is not prod or master... skipping ITOS deploy"
        exit 0
        ;;
esac

echo "Deploying to $GEAR_NAME ($GEAR_USER_URL)"

# Make a new repo in build
pushd build

echo "$STASHED_HASH" > BUILD_COMMIT

# mount up the already used cache dir here
mkdir -p node_modules
sudo mount -o bind ../node_modules node_modules

# npm speed opts
npm set progress=false

echo "Installing prod npm packages"
time NODE_ENV=produtcion npm install --cache-min 14400 --loglevel error

# fix insightsbeta
if [ $GEAR_NAME == "insightsbeta-labsprod" ] || [ $GEAR_NAME == "insightsbeta-labsdev" ]
   then
       sed -s 's|<base href="/insights/">|<base href="/insightsbeta/">|' -i ./index.html
       sed -s "s|appName:[ ]*'insights'|appName: 'insightsbeta'|" -i ./index.html
       sed -s "s|isBeta:[ ]*false|isBeta: true|" -i ./index.html
fi

# Back out
popd

# rsync over everything
echo "Rsyncing data to the gear"
time rsync -aqPS --delete build/* ${GEAR_USER_URL}:~/app-root/repo/

# Restart app
echo "Ensuring forever is installed on the gear"
time ssh $GEAR_USER_URL 'cd $OPENSHIFT_REPO_DIR && which forever >/dev/null 2>&1 ; if [ $? != 0 ] ; then npm install -g forever ; fi'

echo "Restarting the app"
time ssh $GEAR_USER_URL 'ctl_all restart'

echo
echo
