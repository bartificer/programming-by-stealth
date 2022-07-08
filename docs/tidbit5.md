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

#### The Quick & Dirty Way — Download & Update Links

If you have an HTML file that's loading something from a URL, say a script, a stylesheet, or an image, the simplest things to do is to pop that URL into your browser, download what ever it is, add it to your project (by tradition in a folder named `contrib`), and update the URL to the appropriate relative URL to your downloaded file. This works great for files that don't reference other files, but it breaks down if you download a stylesheet that references a whole bunch of images, or, if you just have a lot of remote resources in your file.

If you make this change, it should be on a temporary basis, because this approach is not practical in the long term for at least three reasons:

1. You've just taken responsibility for keeping your copy of these resources up to date from a security POV
2. If you publish your code in this form, you may be breaching the third party's license agreement
3. You've just made your project a lot bigger

If you do go this route, I suggest merely commenting out the references to the CDN-hosted resources so you can quickly and easily un-do your hackery when you get home.

#### Doing it Right — NPM + Bundler

The right way to localise your dependencies is to add them to your project with a package manager like NPM, and then to bundle them into your HTML file using a bundler like Webpack. Note that we have not yet covered this use of Webpack in the PBS series, but [this tutorial shows how it's done](https://www.sitepoint.com/bundle-static-site-webpack/).

### Off-line Docs

As a general rule, you want the most up-to-date documentation you can get, so most documentation is on websites these days. That's great while you're developing from home, but it's a real problem when you have poor connectivity!

You can either download the documentation you want in a format you can read on your laptop or tablet (ebooks can work well), or, you can use a tool like Dash to manage your docs for you. [Dash](https://kapeli.com/dash) is great because it has a good UI for searching and bookmarking, and, it keeps local copies of all the *docsets* you add to it. I always use Dash, whether I'm travelling or not!

### Local Alternatives to Online Utilities

If you use online tools for testing regular expressions or picking colours, you'll need to find app-based alternatives. I generally find apps easier to use anyway, so when you find a good one to replace what ever web tool you use, you may well end up sticking with the app in the long term anyway.

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

Remember – at a technological level, every copy of a Git repo is equal, all are full clones with a full version history because Git is a peer-to-peer technology, not a client-server technology. Commits get synchronised between repositories when you push and pull, so you can make as many commits in your repo as you like and they will all get synced next time you push.

You might wonder what the point is? Sure, Git can be used as a remote backup, but it's primary purpose is to give you versioning, and that's just as valuable while you're travelling as while you're home. Being away doesn't insulate you from making mistakes 🙂

### Push When You Can

The more work you do, the more not having a backup will bother you, so when ever you get a sip of internet, make use of it to push all your commits to GitHub (or what ever server you use).

Code is just text, and Git is efficient, so pushing your code should use very little of your precious bandwidth.

#### Consider Creating a Temporary Local 'Remote'

If not having any backups makes you uncomfortably nervous, consider adding an additional *remote* on a thumb-drive or exteral hard drive. You can keep it disconnected most of the time, plug it in, push, and then take it out again.

Remember that a *remote* is any other Git repo, even another one sharing your file system. The URL to a local remote is simply the path to the folder containing it. The simplest thing to do is to clone the new remote from your primary repo, then add the new repo to your primary repo with a sensible name like `temp_backup`, and push to that new remote regularly.

### Avoid Merge Conflicts — Use a Dedicated Branch

If you share a repo with other people, you run the risk of merge conflicts delaying your pushes and pulls when you sporadically get online. You could probably do without the stress of resolving merge conflicts when your internet connection is a scarce resource, so my advice is to avoid the problem by working on a branch that's just for you. I would suggest giving it a name that clearly marks it as yours, and letting your co-contributors know what the branch is, why you created it, and to please leave it well enough alone!

## When You Get Back

### Undo any Quick & Dirty Workarounds

If you used workarounds to localise your dependencies as opposed to using NPM and a bundler, un-do those changes and commit to the branch you've been working on before you merge your changes into the appropriate permanent branch. You don't want to confuse things with workarounds on a `main` or feature branch that's around for the long-haul!

### Merge, and Expect Conflicts to Resolve

Assuming you were working on a repo with multiple collaborators, you'll need to merge all your changes, and if you've been away for a while, and the others have been busy too, there's a good chance of a merge conflict. Assume there will be, clear some space in your schedule, make a big mug or glass of your beverage of choice, and just work through them slowly and carefully. Usually, there are much fewer conflicts than you feared, so you end up with some quiet time in your schedule, and a nice drink 🙂

### Clean Up!

Once you've safely merged your changes, remember to clean up any temporary branches or remotes you created.

## Final Thoughts

There's nothing more frustrating that finally having the time to get stuck into that code that's been burning a hole in your brain for months than finding you're missing the tools you need to get the job done. Conversely, there's nothing more satisfying that getting all those ideas out of your head and into working code. The difference between the two is simply preparation. Take the time to prepare, and you'll be rewarded with that wonderful feeling of satisfaction we all get from creating great software!

Enjoy your vacation 🙂