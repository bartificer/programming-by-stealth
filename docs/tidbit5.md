# PBS Tibit 5 of Y — Tips for the Vacationing Programmer

If bashing away on some code on a beach-side Mediterranean terrance  with a pitcher of sangria in a warm August evening breeze is your idea of heaven, this special instalment is for you 🙂 Those of us who really love programming love to get deep into some purely personal coding projects while we're on our summer vacation, but if often fails to go to plan because of internet connectivity issues. If you want your vacation coding projects to go well, you absolutely need to do some prep work before you board that plane or start up that old camper van!

Every situation will be different, but you'll fall somewhere on two spectra — from the same hardware you normally use to totally different hardware, and from the same level of connectivity to none at all. 

We'll be looking at this from the POV of a Programming by Stealth listener/reader, so we'll be assuming the PBS tool chain (HTML, CSS, JavaScript, jQuery, Bootstrap, NPM/NodeJS, JSDoc, Jest, Webpack & NPM), but, the principles apply globally, and the specifics can be translated/adapted to other tool chains.

## Matching Podcast Episode

TO DO

## Before You Go

### Patchy Patchy Patch Patch 😉

Even if you're expecting to have relatively fast internet access, it makes sense to get all your software patched from the comfort of your own home before you set off. I strongly advise patching the OS, updating any app store apps, and opening the other apps you use to let them check for updates and do their little re-start dance.

### Clone the Repo(s)

Again, from the comfort of your own home, clone all the repos you think you might want to work on. That seems like an obvious thing to do, but I have some less obvious advice — also clone other repost that use similar technologies that you might want to take a peep at to remind yourself how something is done. Given modern hard drive sizes, code is negligible, so better to clone more than you need than to find yourself wishing you could just have a quick look at some function or other you remember having to spend a lot of time on.

### Build the Projects

Depending on the complexity of the project and the toolset you're using you should do what ever you need to do to turn the checked out repo into working code.

If you use NPM then that means doing an `npm ci` at the very least to make sure all the dependencies are installed. If the code has been un-updated for a while, consider updating your dependencies to their latest versions with `npm outdated` and `npm upgrade` etc..

### Test the Entire Tool-chain

Again, depending on your toolset you should try all the relevant processes while disconnected from the network, i.e. if you use JSDoc, do an `npm run docs`, if you use a bundler, do an `npm run build`, and if you have a test suite, remember to verify everything is working properly with an `npm run test`.

If you need any other tools to write, test, or run your code, test those too.

### Localise Dependencies

One reason your tool chain and/or tests might fail is that you're making use of CDN-hosted dependencies. These can obviously only be accessed while you have internet access, so you may want to permanently or temporarily replace them with local copies.

#### The Quick & Dirty Way

#### Doing it Right

### Off-line Docs

### Local Alternatives to Online Utilities

### Checklist

1. OS patched?
2. All software installed?
3. All software patched?
4. All repos cloned?
5. All builds tested and working while off-line?
6. All build products tested and working while off-line?
7. All docs available while off-line?
8. All tools/utilities working while off-line?

## While You're Away

###  Commit Early & Commit Often

### Push When You Can

### Avoid Merge Conflicts — Use a Dedicated Branch

## When You Get Back

### Merge, and Expect Conflicts to Resolve

## Final Thoughts


