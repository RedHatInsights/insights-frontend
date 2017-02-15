# Insights Front End

Development
---
**Requirements**

1. Node.js & npm & ruby (for sass)
2. gulp (Installed via `sudo npm install gulp -g`)
3. bower (Installed via `sudo npm install bower -g`)
4. bundle (Installed via `gem install bundle`)
4. compass (Installed via `gem install compass`)
4. sass-css-importer (Installed via `gem install --pre sass-css-importer`)
4. breakpoint (Installed via `gem install breakpoint`)
5. accessproxy (Installed from https://github.com/redhataccess/accessproxy)

**Getting started**

1. `npm install`
    - This may print some errors on optional dependencies.  This is okay.
2. `bower install`
3. `bundle install`
4. `gulp` (or `gulp dev-stable` to do work on the stable mode application)

Once the API and `accessproxy` are both running, you can access the UI at:

http://ci.foo.redhat.com:1337/insightsbeta or http://ci.foo.redhat.com:1337/insights

Once loaded, you can switch to your local API instance by going to /insightsbeta/config/dev and then picking the "local" API Root preset.

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

1. Fork the master branch into a new feature branch (name the branch INSIGHTS-XXXX if this change is tracked by a JIRA issue)
2. Add and commit your changes.
3. Squash your commits to achieve reasonable level of granularity
4. Push your branch (git push origin INSIGHTS-XXXX)
5. Create a [new pull request](http://labs-git.usersys.redhat.com/labs/insights/merge_requests/new). Use your feature branch as the source branch and `labs/insights, master` as the target branch. Assign the merge request to someone for review.

**Contributing your changes to stable-X.Y (/insights)**

Make sure you submit a merge request for master first. There may be cases where a merge request for master is needed but these are rare.

1. Fork the stable-X.Y branch into a new feature branch. Use a `-stable` suffix to distinguish this branch from the one for master. Name the branch INSIGHTS-XXXX-stable if this change is tracked by a JIRA issue.
2. Add and commit your changes. You can use `git cherry-pick` to take specific commits from another branch and apply them.
3. Squash your commits to achieve reasonable level of granularity
4. Push your branch (git push origin INSIGHTS-XXXX-stable)
5. Create a [new pull request](http://labs-git.usersys.redhat.com/labs/insights/merge_requests/new). Use your feature branch as the source branch and `labs/insights, stable-X.Y` as the target branch. Assign the merge request to someone for review.

When submitting a trivial change (e.g. a simple typo fix) that applies cleanly to both master and stable-X.Y branches you can skips the steps described in this section. Instead, only send a merge request against the master branch (as described in "Contributing your changes to master (/insightsbeta)" section). In addition, use merge request label "stable" on the merge request. The label indicates to the reviewer that besides a merge to the master branch, they should also cherry-pick the change to the stable-X.Y branch. Use this shortcut only for simple changes after you verified that the change applies cleanly to both branches. Otherwise, the reviewer will likely reject your merge request.
