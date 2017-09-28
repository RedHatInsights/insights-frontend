# Insights Front End
[![Build Status](https://travis-ci.org/RedHatInsights/insights-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-frontend)
[![dependencies Status](https://david-dm.org/RedHatInsights/insights-frontend/status.svg)](https://david-dm.org/RedHatInsights/insights-frontend)
[![devDependencies Status](https://david-dm.org/RedHatInsights/insights-frontend/dev-status.svg)](https://david-dm.org/RedHatInsights/insights-frontend?type=dev)

Development
---
**Requirements**

1. Node.js & npm
2. gulp (Installed via `sudo npm install gulp -g`)
3. bower (Installed via `sudo npm install bower -g`)
4. compass (Installed via `gem install compass`)
5. sass-css-importer (Installed via `gem install --pre sass-css-importer`)
6. breakpoint (Installed via `gem install breakpoint`)
7. insights-frontend-assets (https://github.com/RedHatInsights/insights-frontend-assets)
8. insights-proxy (https://github.com/RedHatInsights/insights-proxy) or accessproxy (https://github.com/redhataccess/accessproxy)

**Getting started**
1. Init the assets submodule
    - `$ git submodule init && git submodule update`
2. Install NPM dependencies
    - `$ npm install`
    - This may print some errors on optional dependencies.  This is okay.
3. Start the development server
    - `$ gulp`
    - Or `$ gulp dev-stable` to do work on the stable mode application
4. Run the Insights proxy
    - `# docker run --net=host -e MODE=all/content -p1337:1337 -ti docker.io/iphands/insightsproxy`
    - Or install and use the accessproxy npm cli app

Once the node server and `insights-proxy` are both running, you can access the UI at:

- http://prod.foo.redhat.com:1337/insights
- http://stage.foo.redhat.com:1337/insights
- http://qa.foo.redhat.com:1337/insights
- http://ci.foo.redhat.com:1337/insights
- http://prod.foo.redhat.com:1337/insightsbeta
- http://stage.foo.redhat.com:1337/insightsbeta
- http://qa.foo.redhat.com:1337/insightsbeta
- http://ci.foo.redhat.com:1337/insightsbeta

Once loaded, you can switch to your local API instance by going to /insightsbeta/config/dev and then picking the "local" API Root preset.

**Branching**

There are 3 branches that will automatically push code out:

- master pushes code to Beta CI then if smoke tests pass to Beta Prod
- stable-4.x pushes code to Stable CI
- production-stable pushes code to Stable Prod

All development branches should be prefixed with one of the following

- fixes/      (for simple non feature bug fixes)
- features/   (for normal work intended to go to master)
- stable/     (for patches intended to go to stable)
- test/       (misc stuff)

i.e.
```
[master]$ git checkout -b features/super_cool_feature
```

**Localization**

1. If you are adding any new English text, please add the translate tag.
2. Use rh_locale and locale_debug Cookies to test your changes.  A newly added English text with a correct tag will appear as "[MISSING]: text" until a proper translation is added.
3. Once you are happy with the changes, run `gulp pot` and check in the new pot file for translation.

## Contributing your changes

Before contributing your changes get familiar with the way master and stable branches work ([see diagram](https://docs.google.com/a/redhat.com/drawings/d/1msfgOEE3faiCTdUv4I3BLN37y0ibNY0oQjAlUq4tQhQ/edit?usp=sharing)) and the [release process](https://mojo.redhat.com/docs/DOC-1059887).

**Contributing your changes to master (/insightsbeta)**

This is the primary vehicle for getting your changes to Insights frontend.
Every change should go to master `(/insightsbeta)`.
Optionally, you may also want to apply your changes to stable-X.Y `(/insights)`.
See the next section for instructions on how to do that.

1. Fork the master branch into a new feature branch (name the branch features/XXXX)
2. Add and commit your changes.
3. Squash your commits to achieve reasonable level of granularity
4. Push your branch (git push origin features/XXXX)
5. Create a [new pull request](https://github.com/ansible/insights-frontend/compare?expand=1). Use your feature branch as the source branch and `master` as the target branch. Assign the merge request to someone for review.

**Contributing your changes to stable-X.Y (/insights)**

Make sure you submit a merge request for master first. There may be cases where a merge request for master is needed but these are rare.

1. Fork the stable-X.Y branch into a new feature branch. Use a `-stable` suffix to distinguish this branch from the one for master. Name the branch features/XXXX-stable.
2. Add and commit your changes. You can use `git cherry-pick` to take specific commits from another branch and apply them.
3. Squash your commits to achieve reasonable level of granularity
4. Push your branch (git push origin features/XXXX-stable)
5. Create a [new pull request](https://github.com/ansible/insights-frontend/compare?expand=1). Use your feature branch as the source branch and `stable-X.Y` as the target branch. Assign the merge request to someone for review.

When submitting a trivial change (e.g. a simple typo fix) that applies cleanly to both master and stable-X.Y branches you can skips the steps described in this section. Instead, only send a merge request against the master branch (as described in "Contributing your changes to master (/insightsbeta)" section). In addition, use merge request label "stable" on the merge request. The label indicates to the reviewer that besides a merge to the master branch, they should also cherry-pick the change to the stable-X.Y branch. Use this shortcut only for simple changes after you verified that the change applies cleanly to both branches. Otherwise, the reviewer will likely reject your merge request.
