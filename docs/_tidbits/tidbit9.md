---
title: Using Git on iOS
instalment: 9
creators: [bart, allison]
date: 2024-10-10
opengraph:
  audio: TO DO
---
For a long time, I assumed iOS could not give a good Git experience. Because each app lives in its own little play-pen, I hoped I could find an all-in-one app that was both a Git client and a good editor for every file type I needed to work with. I didn't expect to find such a unicorn app! It turns out that on modern versions of iOS, that's just not true anymore, and actually, it hasn't been true for many years now. The key is the ever-improving built-in Files app which gives users the ability to create and manage local files and folders on iPhones and iPads, and apps the APIs **???** they need to ask users to connect them to local folders and files.

Note that this change has not weakened the security of iOS apps. Without a user explicitly connecting an app to a folder, no app can reach outside its sandbox, so this new functionality didn't require sacrificing iOS's very strong security architecture.

Big-picture-wise you can now use Git on iOS in the following way:

1. Create a local folder on your iOS device using the Files app
2. Use a Git app to convert that folder into a local Git repository and optionally connect it to a remote Git server
3. Use any editing app that supports iOS's local file access APIs to edit the files in the local Git repository.

**Don't forget to mention Jill of Kent**

## Matching Podcast Episode

TO DO

# Prerequisites

- A copy of [WorkingCopy](https://workingcopy.app) installed on your iOS device, and successfully connected to a Git server. I’ll be using [GitHub](https://github.com) over SSH. **WorkingCopy requires the $14.99 Pro version to link to external repositories.**
- One or more text editors with the ability to open folders from the Files app. For example, I like to use [Textastic](https://www.textasticapp.com) to edit Markdown files.

# Initial Setup of a Repo

## Step 1 — Create a Local Folder

Open the Files app, and navigate to the *'on my iPhone/iPad'* top-level section.

Click the three dots icon and then *‘new folder’.*

  ![Create a new folder in the iOS Files app](assets/tidbits9/iOSGitExteralEditor-Screenshot1.png)

## Step 2 — Configure the Folder as a Git Repo

Open WorkingCopy, and at the top level page that lists all your repos, use the plus on top of a fingerprint button **you called it a plus button and it is in your screenshot but the latest version has it as a fingerprint with a plus on it**, select *‘Link external directory’*  and then *'Directory'* from the dropdown to connect to the folder you just created in Files. **another change in the latest version**

![Link an external directory in WorkingCopy](assets/tidbits9/iOSGitExteralEditor-Screenshot2.png)

You now have an empty local Git repo with no commits. To use your Git server, you need to add a remote to this local repo. 

## Step 3 — Add a Remote to the Local Repo

Before you go any further, you’ll need to fetch the URL for your desired repo on your Git server. For fellow GitHub users, note that you’ll need to use the web interface, because I have not found a way of getting the GitHub iOS app to show the SSH URL for a repo!

In WorkingCopy, enter the new linked shared folder and click the *‘Repository’* button:

![Open the Repository settings in WorkingCopy](assets/tidbits9/iOSGitExteralEditor-Screenshot3.png)

On the repository setting page, click the *‘Configuration’* button:

![Open the Configuration interface in the WorkingCopy repository](assets/tidbits9/iOSGitExteralEditor-Screenshot4.png)

You’ll see one or more identities in a list that doesn’t look like a list at the top of the page — select the identity you set up in WorkingCopy that’s connected to your server. For me that’s my GitHub account. When you have an identity ticked, back out to the repository settings page again.  **(wow, that was NOT obvious!!! how did you figure that out???)**

Now that WorkingCopy knows which authentication details to use, you’re ready to link your local repo to the appropriate repo on your server.

Click the button to add a remote and paste in the URL you fetched earlier.

![Add the URL to your remote repo in Working Copy](assets/tidbits9/iOSGitExteralEditor-Screenshot5.png)

Back on the repository setting page, click the three dots and choose *‘fetch’*, that should pull in the list of remote branches: **curious they use "fetch" instead of "pull"**

![Fetch the remote branches in WorkingCopy](assets/tidbits9/iOSGitExteralEditor-Screenshot6.png)

**what do we do after Fetch? I'm still on the same screen that shows the Fetch and push buttons. I tried to back out and I get a red banner saying "you need to save or discard changes to remote". So I saved, and now I see current at the top, and configuration like before but the red banner is still there and I don't know how to check out "any remote branch". Ah, tapping the red banner makes it go away More details on this part please?**

**I'm using PBS as the git repo. I did find Branch but it takes me to only one called "main unborn HEAD"! and then says 'cannot locate remote-tracking branch 'main'.**

**Ohhhh! you have to hit the back chevron in the upper left (on iPadOS) to see the list of Repos again. this didn't happen on iOS.**

You can now check out any remote branch you wish to work on by selecting Branch under Configuration. When you find the branch you want, select Checkout.

**At this point I became hopelessly lost. While I can see PBS in WorkingCopy and I've checked out this very tidbits9 branch, I can't find it in my Files app. The Git folder I created locally on the iPad is empty and there is no PBS folder. I'm baffled how it's working in WC but not visible in Files! Same thing on iOS. I assume I missed a step (twice)?**

# Day-to-Day Use

1. Check out the desired branch in WorkingCopy
2. Open the folder in your text editor of choice and make your edits
3. Use WorkingCopy to commit, push, pull etc.