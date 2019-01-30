# Used for pushing to build repo in a travis-ci deploy
set -e

if [ "${TRAVIS_BRANCH}" == "master" ]; then DEPLOY_BRANCH="prod-beta"; fi
if [ "${TRAVIS_BRANCH}" == "stable" ]; then DEPLOY_BRANCH="prod-stable"; fi
if [ -z "${DEPLOY_BRANCH}" ]; then
    echo "Not configured to deploy anything for this branch: ${TRAVIS_BRANCH}"
    exit 1
fi

if [ -z "${GITHUB_AUTH}" ]; then
    echo "Env var for github credentials not provided by Travis"
    exit 1
fi

# Set up git and check out insights-frontend-build
mkdir -p ~/insights-frontend-build
cd ~/insights-frontend-build
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git init .
git remote add origin https://${GITHUB_AUTH}@github.com/RedHatInsights/insights-frontend-build.git
git fetch origin
git checkout -b ${DEPLOY_BRANCH}
cd -

# Build with 'gulp prod' and then get tag from package.json
node --max_old_space_size=4096 --optimize_for_size --stack_size=4096 gulp prod
export PKG_TAG=$(node -e 'console.log(require("./package.json").version)')

# Add some of our tags into the html content
cd build
sed -s "s|___TAG___|${PKG_TAG}|g" -i index.html
sed -s "s|___COMMIT___|${TRAVIS_COMMIT}|g" -i index.html
if [ "${DEPLOY_BRANCH}" == "prod-beta" ]; then
    cp ./index.html ./indexbeta.html
    sed -s "s|<base href=\"/insights/\">|<base href=\"/insightsbeta/\">|" -i ./indexbeta.html
    sed -s "s|appName:[ ]*''insights''|appName: ''insightsbeta''|" -i ./indexbeta.html
    sed -s "s|isBeta:[ ]*false|isBeta: true|" -i ./indexbeta.html
fi

# Copy the artifacts into our build repo dir
yes | cp -r * ~/insights-frontend-build

# Push our updated build artifacts to git
cd ~/insights-frontend-build
git add -A
git commit -m "Auto-update via Travis build: ${TRAVIS_BUILD_NUMBER}"
git fetch origin
git rebase origin/${DEPLOY_BRANCH}
git push origin ${DEPLOY_BRANCH}
cd -
