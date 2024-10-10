---
title: Using Git on iOS
instalment: 9
creators: [bart, allison]
date: 2024-10-10
opengraph:
  audio: TO DO
---
For a long time I assumed iOS could not give a good Git experience, because each app lives in its own little play-pen, so the best I could hope for was an all-in-one app that was both a Git client and a good editor for every file type I need to work with. I didn't expect to find such a unicorn app! It turns out that on modern versions of iOS, that's just not true anymore, and actually, it hasn't been true for many years now. The key is the ever improving built-in Files app which gives users the ability to create and manage local files and folders on iPhones and iPads, and apps the APIs they need to ask users to connect them to local folders and files.

Note that this change has not weakened the security of iOS apps, without a user explicitly connecting an app to a folder, no app can reach outside its sandbox, so this new functionality didn't require sacrificing iOS's very string security architecture.

Big-picture-wise you can now use Git on iOS in the following way:

1. Create a local folder on your iOS device
2. Use a Git app to convert that folder into a local Git repository and optionally connect it to a remote Git server
3. Use any editing app that supports iOS's local file access APIs to edit the files in the local Git repository.

## Matching Podcast Episode

TO DO

# Prerequisites

- A copy of [WorkingCopy](https://workingcopy.app) installed and successfully connected to a Git server, I’ll be using [GitHub](https://github.com) over SSH
- One or more text editors with the ability to open folders from the Files app. For example, I like to use [Textastic](https://www.textasticapp.com) to edit Markdown files.

# Initial Setup of a Repo

## Step 1 — Create a Local Folder

Open the Files app, navigate to the *'on my iPhone/iPad'* top-level section.

Click the three dots icon and then *‘new folder’.*

  ![Create a new folder in the iOS Files app](assets/tidbits9/iOSGitExteralEditor-Screenshot1.png)

## Step 2 — Configure the Folder as a Git Repo

Open WorkingCopy, and at the top level page that lists all your repos, use the `+` button and *‘Link external directory’* to connect to the folder in Files.

![Link an external directory in WorkingCopy](assets/tidbits9/iOSGitExteralEditor-Screenshot2.png)

You now have an empty local Git repo with no commits. To use your Git server, you need to add a remote to this local repo. 

## Step 3 — Add a Remote to the Local Repo

Before you go any further, you’ll need to fetch the URL for your desired repo on your Git server. For fellow GitHub users, note that you’ll need to use the web interface, because I have not found a way of getting the GitHub iOS app to show the SSH URL for a repo!

In WorkingCopy, enter the new linked shared folder and click the *‘Repository’* button:

![Open the Repository settings in WorkingCopy](assets/tidbits9/iOSGitExteralEditor-Screenshot3.png)

On the repository setting page, click the *‘Configuration’* button:

![Open the Configuration interface in the WorkingCopy repository](assets/tidbits9/iOSGitExteralEditor-Screenshot4.png)

You’ll see one or more identities in a list that doesn’t look like a list at the top of the page — select the identity you set up in WorkingCopy that’s connected to your server. For me that’s my GitHub account. When you have an identity ticked, back out to the repository settings page again. 

Now that WorkingCopy knows which authentication details to use, you’re ready to link your local repo to the appropriate repo on your server.

Click the button to add a remote and paste in the URL you fetched earlier.

![Add the URL to your remote repo in Working Copy](assets/tidbits9/iOSGitExteralEditor-Screenshot5.png)

Back on the repository setting page, click the three dots and choose *‘fetch’*, that should pull in the list of remote branches:

![Fetch the remote branches in WorkingCopy](assets/tidbits9/iOSGitExteralEditor-Screenshot6.png)

You can now check out any remote branch you wish to work on.

# Day-to-Day Use

1. Check out the desired branch in WorkingCopy
2. Open the folder in your text editor of choice and make your edits
3. Use WorkingCopy to commit, push, pull etc.