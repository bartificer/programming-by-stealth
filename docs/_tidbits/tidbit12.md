---
title: XKPasswd Rewrite Exits Beta
instalment: 12
creators: [bart, helma]
date: 2025-04-26
---

> Note that the introduction is written by Bart, but the remaining content is all written by Helma.
{: .aside}

In the past few years, the technologies we've been covering in the PBS series have been heavily influenced by the needs of the XKPasswd secure memorable password generator open source project's needs. I (Bart) built [the original version in Perl](https://metacpan.org/pod/Crypt::HSXKPasswd) and released it under the completely free BSD license. It needed to be rewritten in JavaScript, and to do that properly, I needed to learn to use a bunch of new technologies, and being time-constrained, I couldn't continue teaching one set of technologies in the PBS series and learning a whole other set in the background. Either I had to stop doing PBS, abandon XKPasswd, or bring the two together in some way. 

After chatting with Allison about it, we decided to re-focus PBS on the technologies needed to deliver a real-world JavaScript-based web app, using XKPasswd as the example, and to try to empower those in the podcast community who were interested to develop into an open source community around XKPasswd. That way, I was always working towards two goals at once, and, hopefully, I wouldn't have to do it all alone. We also knew that podcast listener [Helma van der Linden](https://github.com/orgs/bartificer/people/hepabolu) was keen to help, so we knew we'd have at least one person from our community working on the XKPasswd rewrite.

To cut a long story short, it was not a case of Helma helping me, but me occasionally offering guidance to Helma, and then getting out of the way while she led the charge, and plenty of other podcast listeners joined in to help. Helma's work has been nothing short of amazing, and in April 2025, we crossed a major milestone — the rewrite she led has come out of beta, and is now powering [the production XKPasswd website](https://www.xkpasswd.net) 🎉

Helma joined me for this TidBit instalment to share the last part of that story with me and with the community. The remainder of these notes are from Helma.

Thanks again, Helma, for your outstanding work. I'm humbled and oh so grateful!

— Bart

## Matching Podcast Episodes

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2025_04_18.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2025_04_18.mp3" >Download the MP3</a>

Read an unedited, auto-generated transcript with chapter marks:  <a href="https://podfeet.com/transcripts/PBS_2025_04_18.html">PBS_2025_04_18</a>

## Problem to be solved

When the port of XKPasswd from Perl to JavaScript started, it was much easier to keep the library and web app in the same directory structure and in the same repository. 
Now that the main functionality of both the library and the web app is ported, it is time to split them into separate components, with each residing in its own repository. Of course, this can be done the crude way. We just copy over the files we need and don't care about the history. But it would be a good thing if we could preserve history in the split.

## Lay of the land

At the moment, before the split, there are two repositories that come into play: the `xkpasswd-js` repository, holding all the code and the history of the port to JavaScript, and the `www.xkpasswd.net` repository, holding all the old Perl code that drove the original website. Bart has conveniently zipped up the old Perl code and shoved it into a release and a separate branch. So the current repository only has the page that redirects to the beta version of the new site.

To make writing and reading less tedious, from now on, let's call the `xkpasswd-js` repository the `js` repository and the `www.xkpasswd.net` repository the `net` repository.

We want to end up with the webapp code with its history moved into the `net` repository and out of the history of the library code, still in the `js` repository. Of course, we don't want to mess with the original history of the `net` repository, so after the split, we need to somehow merge the newly generated repository into the `net` repository's history.

Once the split is completed, the `net` repository will include the library in some manner. How this will be done is yet to be decided. The `net` repository will then serve as the source for the webapp on GitHub Pages. The `js` repository currently produces the webapp on GitHub Pages. After the split, the GitHub Pages site will contain the documentation JSDocs files.

We are going to update the current remote `js` repository with the content of the split that contains the library part. This means the remote repository will be changed in a destructive way. So if there is a problem, there is no turning back, and everybody who has a local version of the repository needs to delete it and reclone the new version. 

We can mitigate the first problem by creating a mirror. This can also serve as a reference should any questions arise. The second problem cannot be resolved automatically. We can only remove all write access to the repository and add a banner to the repository that it has been changed substantially and needs to be re-cloned.

## Preparations

Before we start, the GitHub Action needs to be changed. Currently, any push to the main branch will run the build script and update the GitHub Pages website. We don't want the website updated should anything go wrong, and then remove the website. On the other hand, a mirror should not interfere with the current version of the website. 
So the final commit and push on the original `js` repository will be the change to disable the GitHub Action.

To mirror a repository is a matter of creating a second remote and pushing the local version to this second remote.

With all these details to take into account, wouldn't it be easier to simply rename the current `js` repository to something like `xkpasswd-js-original` or `xkpasswd-js-backup` and create a new `js` repository with the content of the split? That is certainly possible, but then also all the issues will end up in the renamed repository as well as all followers, forks, and stars. Not something we want.

First, make sure that the local copy of the `js` repository is up to date by pulling all changes from all branches. Use the preferred way, GUI client or command line, to get all changes pulled. Then update the remote repository by pushing all changes that need to be in the repository. 

The split of a git repository can be done with the command `git filter-repo`. According to documentation, this is a destructive operation, aka it removes the unwanted history. This should be done very carefully, so the first thing to do is create a copy of the project to be split.

Check if there are branches that are merged and no longer needed. If so, delete them to make the process simpler. 

After removing all the merged branches, two are left in `js`. One is called `puppeteer`. It exists only locally and contains attempts to write Puppeteer tests to automatically test the webapp. Therefore, it needs to move to the new repository after the split.

The other branch is also local and is called `issue-37,` and although the accompanying issue is already closed, this branch is not fully merged.  After further inspection, it looks like this branch contains only 1 commit, and there is a later commit that properly fixes the issue. So let's delete this branch as well. Because this branch contains a commit, we need to use the `force-delete` flag to also remove that branch.

Just to be sure, we merge `main` into `puppeteer` and resolve the (minor) conflicts. Now everything should be ready for the split.

Since `puppeteer` is a local branch, it will not end up in the final split, because the split is done on a fresh clone of the GitHub version. So we need to push the `puppeteer` branch as well.

Now it's time to disable the GitHub Action by commenting out the push action. 

```
name: Deploy xkpasswd to Pages

on:
  # Runs on pushes targeting the default branch
  # push:
    # branches: ["main"]
```

After the final commit and push, we can create a copy of the repository. On GitHub, create a new repository `xkpasswd-js-backup`. Add the remote to the `js` repository:

```shell
git remote add backup https://github.com/bartificer/xkpasswd-js-backup.git
git push backup --mirror
```

Final check to see if the website is still up and running and that the backup repository has all the files and branches, as well as NO website. Now it's time for the actual split.


### Preparing the actual split


It is time to create a clone of the original `js` repository, because the `filter-repo` command requires a fresh clone.

```shell
mkdir xksplit
git clone https://github.com/bartificer/xkpasswd-js.git
```

Note, the repository is now cloned in `xksplit/xkpasswd-js`.

Now we can work on the copy and restart when things go wrong.

The steps to perform are described here:

- https://docs.github.com/en/get-started/using-git/splitting-a-subfolder-out-into-a-new-repository
- https://stackoverflow.com/a/67337718

The latter is a comment that describes what to do, in addition to the GitHub documentation, when you want history in all relevant branches to be split.

To take away some of the confusion: the Stackoverflow post is 4 years old (at the time of writing this article) and refers to the GitHub documentation and the use of `filter-branch`.

The GitHub documentation, in turn, refers to a separate tool called [filter-repo](https://github.com/newren/git-filter-repo), which was updated a few months ago. In other words, it's under active development. Given the rationale for this tool (`filter-branch` is slow and buggy) and the fact that official GitHub documentation refers to it, let's use `filter-repo` instead of `filter-branch`.

Checking the prerequisites as mentioned in the documentation:

> filter-repo requires:
>
> - git >= 2.36.0
> - python3 >= 3.6

```shell
# git --version
git version 2.48.1

# python3 --version
Python 3.13.1
```

Yep, versions are compatible. If not, install the required versions or some version more recent. Download the latest release of the `filter-repo` tool and unpack it in a directory. Either add the directory to `$PATH` or just use the script with its full path. Let's do the former so the subsequent commands will be more readable.

Unpacking results in a directory `git-filter-repo-2.47.0`. So

```shell
cd git-filter-repo-2.47.0
PATH=$( pwd ):$PATH
```

As long as we stay in this terminal session, this path update will be available, but we don't have to clutter the global available `$PATH`.

The manual for this tool can be found at [htmlpreview.github.io/...](https://htmlpreview.github.io/?https://github.com/newren/git-filter-repo/blob/docs/html/git-filter-repo.html)

## Split the webapp

We start by splitting off the webapp. That part was taken out of the current `js` repository and merged into the `net` repository.

### What needs to be split

First, make sure you're in the correct directory:

```shell
cd xksplit      # aka change back to this directory
```

This is the current directory layout:

```
.
├── .github           # to web/net
├── buildScripts      # to js
├── docs-other        # to js
│   └── diagrams
├── src
│   ├── assets        # to web/net
│   │   └── img
│   ├── docs          # to js
│   ├── lib           # to js
│   └── web           # to web/net
├── src-diagrams      # to js
└── test              # to js
```

The diagrams are mostly related to the library, so they should stay in the `js` repository. The diagram and the image that refer to the webapp will be copied over manually, and the few git commits for these files will not be copied over. 

The `.github` directory contains the GitHub Actions file that creates the webapp that drives the GitHub Pages site. Therefore, it should be copied over.

The `test` directory contains some examples of configurations for testing the import function. These should also be copied over.

This means that in the above directory structure, only the `src` directory should be split. `assets` contains the images of the webapp as well as the favicon files, so that directory should move as well. Obviously, the `web` directory contains the files for the webapp, the main content to be split. `lib` contains the code for the library and should stay and the same goes for the `docs` directory, which contains custom CSS for the JSDocs pages.

Finally, there are some files in the root directory of the project, such as `package.json` and `webpack.config.mjs`. Some of them need to move, some need to be copied, and some need to be pruned after copy to remove the code specific to the other part. E.g., the `webpack.config.mjs` needs to be copied and modified after the split so each project has its own optimized version.  In `package.json,` the dependencies and build scripts of the other project need to be removed.

In summary, in the `xksplit` repository:

- `src/web` needs to stay
- `src/assets` needs to stay
- All the files in the root directory need to stay
- All other files and directories need to be removed

### Start the split

The [manual](https://htmlpreview.github.io/?https://github.com/newren/git-filter-repo/blob/docs/html/git-filter-repo.html) describes an important option: `--dry-run`. It will simulate the actions, but not actually perform them. We need `--path` multiple times to get the files and directories we need to remain. We also want to prune commits that become empty so we need the `--prune-empty`. The default of `auto` sounds like a good option.

To make sure the command stays short, we can put the paths we want in a file and use the `--paths-from-file` option.


```
# directories and files to keep for the webapp
# directories to keep
.github
src/assets
src/web
test

# files to keep
.editorconfig
.gitignore
LICENSE
README.md
eslint.config.mjs
glob:jest.*
package.json
webpack.config.mjs
```

Note that the `jest.*` line is preceded by the prefix `glob:` to indicate we want all files that start with `jest`.

Save the file in the `xksplit` directory as `webapp.txt`. This ensures that the clone stays 'fresh', aka no untracked changes.

So the command becomes

```shell
cd xksplit/xkpasswd-js
git filter-repo --dry-run --paths-from-file ../webapp.txt
```

output:

```shell
Parsed 571 commits
New history written in 0.07 seconds; now repacking/cleaning...
NOTE: Not running fast-import or cleaning up; --dry-run passed.
      Requested filtering can be seen by comparing:
        .git/filter-repo/fast-export.original
        .git/filter-repo/fast-export.filtered    
```

When we compare both files, it looks like all commits regarding the html will be removed. This means we forgot to include some files: `src/index.html` and `src/index.mjs`.

Add these to the `webapp.txt` file and start again.

It is important to go over the comparisons with great detail, because some files have been renamed or added and subsequently deleted. To keep the history as complete as possible, these deleted files and filenames that have been renamed also need to be included in the `webapp.txt` file.

The final version of the `webapp.txt` becomes:

```
# directories and files to keep for the web app
# directories to keep
.github
src/assets
src/web
test

# files to keep
.editorconfig
.gitignore
LICENSE
README.md
eslint.config.mjs
glob:jest.*
package.json
webpack.config.mjs
src/index.html
src/index.mjs
jest-puppeteer.config.cjs

# directories and files that have later been deleted or renamed
src/index.js
docs/fonts

```

When all relevant commits have been kept, remove the `--dry-run` parameter and execute the command.

Once the split is done, check the git history to see if there are any strange commits and if the commit log makes sense.

Just to be sure, compare the files between the split project and the original project. If everything is ok, all the files in the split project should be identical to the ones in the original project and match the set described in the previous section.

If something is wrong, just start over.

## Split the library

Now that the webapp is correctly split into its own repository, we can repeat the steps for the split of the library. First, rename the `xkpasswd-js` directory under `xksplit` to `websplit` to indicate that it contains the web app and to move it out of the way for the second clone of the `js` repository.


```shell
cd xksplit
mv xkpasswd-js websplit
git clone https://github.com/bartificer/xkpasswd-js.git
```

### What needs to be split

Although the `filter-repo` command contains an `--invert=paths` argument, we don't want the inverse of the files in the websplit. If we look at the tree of the subdirectories

```
.
├── .github           # to web/net
├── buildScripts      # to js
├── docs-other        # to js
│   └── diagrams
├── src
│   ├── assets        # to web/net
│   │   └── img
│   ├── docs          # to js
│   ├── lib           # to js
│   └── web           # to web/net
├── src-diagrams      # to js
└── test              # to js
```

We want everything except the `src/assets`, `src/web,` and the `src/index.*` files. We can now create a configuration file for the `filter-repo`.


```
# directories and files to keep for the library
# directories to keep
buildScripts
docs-other
src/docs
src/lib
src-diagrams

# files to keep
CNAME
2025-01-RepoReorgPlan.md
.editorconfig
.gitignore
LICENSE
README.md
eslint.config.mjs
glob:jest.*
jsdoc.conf.json
package.json
webpack.config.mjs
glob:*/.gitkeep

# directories and files that have later been deleted or renamed
src/index.js
docs

```

Save the content to `library.txt` and repeat the steps as before

```shell
git filter-repo --paths-from-file ../library.txt
```

Check if everything went ok.

## Overriding the js repository in GitHub?

Now that the repository is split, we can update the `js` repository with the new layout. 
But wait.... This is a dangerous operation. It basically means that everyone who ever cloned the repository will have to do that again. If they have made any changes to the code in preparation for a pull request, they will have to manually move these changes over to the new clone.

Speaking of pull requests, GitHub might refuse to update the repository because pull requests might become invalid because the code they refer to no longer exists in the new split repository. Oh, and what about the issues that refer to commits that also no longer exist after the split?

All this led to the decision that it is not a good idea to override the current version of `js` repository on GitHub.

We will keep the `js` repository as is and manually remove the web-related files from it.

## Finish the web repository

### Merging the web repository to the net repository 

Now that the web part is split off, it is time to merge it into the `net` repository. 

First, we need to clone or update the local version of the `net` repository.

In preparation of the split of the `js` repository for the library, we renamed the webapp repository to `websplit`. Now we need to add the `websplit` repository as a remote repository to the current `net` repository, fetch the history, and finally merge with the option to allow unrelated history. The latter makes sure that the merge can be done.


```shell
# add the websplit repo as remote repository
git add remote websplit ../path/to/websplit

# fetch everything
git fetch --tags --prune websplit 

# merge the main of the websplit with the main branch
git merge websplit/main --allow-unrelated-histories

# create a new branch puppeteer
git switch -c puppeteer

# merge the puppeteer of the websplit with the puppeteer branch
git merge websplit/puppeteer --allow-unrelated-histories

```

Check the repository. If anything looks funny or you are unsure, restart with a fresh clone of the `net` repository.

Finally, push to GitHub.

```shell
# push to GitHub
git push -v --tags origin refs/heads/main:refs/heads/main
git push -v --tags --set-upstream origin refs/heads/puppeteer:refs/heads/puppeteer
```

### Moving the issues

To make the split complete, it is necessary to also move the open issues that relate to the webapp. Of course, the issues could be copied over, but when we use the GitHub transfer, the votes are transferred as well. And GitHub redirects from the old issue number to the new one.

The easiest way to do this is to use `gh`, the [GitHub CLI tool](https://docs.github.com/en/github-cli/github-cli/about-github-cli). Transferring issues is documented [here](https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/transferring-an-issue-to-another-repository?tool=cli).

Transferring issue 26 from the `js` repository to the `net` repository is done by the following commands:

```shell
# set the default repository
gh repo set-default bartificer/xkpasswd.js

# transfer issue 26
gh issue transfer 26 bartificer/www.xkpasswd.net
```

Repeat for the other issues. We decided to leave the already closed issues in the `js` repository.

## Finishing the `js` repository

Set a tag, so we can go back. In this case, we chose to set a `websplit` tag.
Remove the webapp code by removing the following directories and files:

```shell
cd /path/to/xkpasswd-js # path to the xkpasswd-js repository
cd src
rm -rf web
rm -rf assets
rm -index.html
rm -index.mjs
```

Now that the web files are removed from the repository, there is no need to have the library code in `src/lib`, so let's move it into the `src` directory.
The `src` directory also contains a `docs` directory that only contains some custom CSS for the JSdocs. Move this CSS file to `docs-other` directory and update the `jsdoc.conf.json` file:

```
     "default": {
       "staticFiles": {
         "include": [
-          "src/docs/jsdoc-xkp.css"
+          "docs-other/jsdoc-xkp.css"
         ]
```

Now move the content of the `src/lib` directory to the `src` directory and update the `jest.config.json` to update the path:

```json
       "testMatch": [
-        "<rootDir>/src/lib/**/?*.test.mjs"
+        "<rootDir>/src/**/?*.test.mjs"
       ]
```

Just to be sure, run the tests to see if all still passes.

```shell
npm run test
```

All tests still pass, so commit and push the changes.

## Add the `js` repo as a submodule to the `net` repo

Now that the `js` repo only contains the code for the XKPasswd library, we can create a submodule in the `net` repo that pulls in this code.

For now, we want to keep it simple. This means the `src/web` code should assume the code for the library is still in `src/lib`. However, if we add the `js` repository as a submodule in `src/lib`, the code will be in `src/lib/src`. This means we have to change the webapp code to find the code in the new location.

Also, in the future, we might create an npm package of the `js` repository, which also moves the code to a different location. 

Let's move the submodule into a separate `modules` directory and create a symlink from `src/lib` to the `src` directory of the `js` repository in the `modules` directory.

The directory structure then becomes:

```
web/
 ├── src/
 │   ├── web/       # Web project files
 │   ├── lib/       # This will be a symlink (not created yet)
 │
 ├── modules/       # Dedicated submodules directory
 │   ├── lib/       # Cloned submodule
 │        ├── src/  # Actual lib source files
 │        ├── package.json
 │        ├── webpack.config.js
 │
 ├── .gitmodules
 ├── package.json
 ├── webpack.config.js
```

The commands to achieve this:

```shell
cd /path/to/www.xkpasswd.net
mkdir -p modules

# Add the lib submodule in modules/
git submodule add https://github.com/bartificer/xkpasswd-js.git modules/lib
git submodule update --init --recursive

# Remove existing directory if it exists
rm -rf src/lib

# Create the symlink
ln -s ../modules/lib/src src/lib
echo "Symlink created: src/lib -> ../modules/lib/src"

# Add src/lib to gitignore to avoid git confusion
echo "src/lib" >> .gitignore
```

To update the submodule the commands will be:

```shell
# given we are in the root directory of www.xkpasswd.net
cd modules/lib
git checkout main
git pull origin main
cd -

# Check if symlink exists, only recreate if missing
if [ ! -L src/lib ]; then
  # echo "Symlink missing! Recreating..."
  ln -s ../modules/lib/src src/lib
fi
```

Now it's time to check if the webapp works as expected.

```shell
npm install # because all the modules used are not yet installed

# start the server
npm run start
```

And it runs!

__UPDATE__: after working through the process to get the webapp published, it turns out that the symlink is not created by the GitHub Action, and therefore the build fails because the library cannot be found.

Of course, it's possible to add a step to the Action workflow to create a symlink, but there is a different method that does not involve the symlink. We can add an alias to the `webpack.config.mjs` file that points to the directory we used in the symlink and uses the alias in the import statement. This is way nicer than creating a symlink, and it also more or less resembles the future when the library will be an npm package.

So the `webpack.config.mjs` gets an extra entry:

```javascript
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'modules/lib/src'),
    },
  },
```

And the import statement in `src/index.mjs` is changed to

```javascript
import {XKPasswd} from '@lib/xkpasswd.mjs';
```

Hooray for creating a gateway class to the library. This means we only have to change one import statement.

## Finalizing the split

Now that the website runs locally, we're in the home stretch. As said before, we can copy over the diagram that covers the webapp.

It's time to reinstate the GitHub Action by removing the comments on the push target

```yml
on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]
```

and commit and push to GitHub.

The Action runs but fails because the configuration for GitHub Pages is different. Currently, the `net` repository is set to deploy from a branch, while the `js` repository was configured to deploy using a GitHub Action. Let's fix that.

But before we do, we need to copy the CNAME file from the `temp-pl-to-js-placeholder` branch. Luckily, that file is the only file in the last commit in that branch, so we can do some cherry picking

```shell
git cherry-pick -n 28ac1951b07a7ee80ff3caeab790002e371b3f22
```

This sounds difficult, but using a GUI client like SourceTree or GitKraken, it's as easy as selecting the commit and then selecting the action to cherry-pick.

Commit the file but hold out on the push. Fix the GitHub Pages configuration first, and then push.

This push fails because the GitHub Action does not pull in the submodule yet, so the library cannot be found. The fix is simply to call the `actions/checkout` with the `submodules` parameter set to true.

```yml
- name: Checkout
   uses: actions/checkout@v4
   with:
     submodules: true
```

Finally, remove the `npm run test` and `npm run docs` steps, because they are not necessary anymore. Commit and push again, and check if the website is up and running on www.xkpasswd.net.

And it is!

# Cleaning up

It's time to clean up:

- Remove the backup repository
- Remove the local `websplit` repository and any other copy that is lingering
- Put up a placeholder page in the `js` repository
- Fix the README in the `js` repository
- Fix the README in the `net` repository

Now both repositories are separate and can be updated and optimized for their own purpose.
