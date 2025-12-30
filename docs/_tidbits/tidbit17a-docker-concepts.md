---
title: Simplifying Developer Setups with Docker - Concepts
instalment: 17a
creators: [helma]
date: 2025-12-22
---

While listening to the episodes PBS 177 through 181 I realised I use a different approach to isolate programming environments, one that I increasingly embrace.

## Problem to Be Solved: Dependency Chaos

As a developer, you've probably faced this: you want to install a tool like Jekyll, and it needs Ruby, Bundler, and specific libraries. You install them, only to realize another project needs a **different** Ruby version. Things start to break.

Welcome to **dependency hell**. Dependency hell is the term coined for the situation where different projects need different versions of the same library or package, but since the package is installed globally on your machine, you can have only one version of that package.

## Another Problem to Be Solved: Outdated setup

Recently, Allison and Bart created a new episode for Taming the Terminal. The previous one was several years ago, so the scripts to build the various formats of the book didn't work anymore because the packages were outdated and required an older version of Ruby than the one currently installed. Of course, we can update everything and make the build system go again, but if Allison or Bart would like to build the book themselves, they would have to go through all the upgrade steps that were done to get the build system up and running again. Also, what if there is a small utility present on my machine that Allison and Bart don't have installed? The build would run smoothly on my machine, while it breaks on theirs. The old 'it works because it runs on my machine' syndrome.

You can escape these nightmares if you isolate each project's environment.

There are three ways to create such an isolation:

- virtual environments
- virtual machines
- Docker

Let's have a look at each of these solutions.

## Virtual Environments

Using **virtual environments** is a lightweight way to isolate dependencies for different projects. They allow developers to avoid version conflicts without needing system-wide installations.

Different languages, such as Ruby, Python, and Node, each have their own solution to virtual environments, such as `venv` for Python and `nvm` for Node.

Let's look at the example Bart and Allison discussed some time ago when they installed Jekyll on their local machines:

### Ruby Virtual Environment Example (with `chruby` + `ruby-install` + `bundler`)

Allison and Bart used these tools to create the virtual environment:

- **`chruby`** -- Lightweight Ruby version switcher.
- **`ruby-install`** -- Installs Ruby versions (used with `chruby`).
- **`bundler`** -- Manages gem dependencies per project.

This is not a repeat of the installation instructions, but merely a summary of the steps involved:

- Install `chruby` and `ruby-install`
- Add the config files to the shell config (`~/.zshrc` or `~/.bashrc`)
- Then reload the shell
- Install a Ruby Version with `ruby-install`
- After all this is installed, install Jekyll.

### Benefits of Using Virtual Environments

What are the benefits of Virtual environments?

1. **Dependency Isolation**
    - Prevents version conflicts between projects.
    - Each project can use its own versions of libraries or packages.
2. **No Global Pollution**
    - Avoids installing packages globally, keeping your system clean. The project only gets the packages it needs in the versions it needs.
3. **Easier Collaboration**
    - Ensures reproducibility. Others can recreate the same environment using a dependency definition file, such as a `requirements.txt` for a Python project, a `Gemfile` for a Ruby project, and of course, a `package.json` for a Node or JavaScript project.
4. **Safe Experimentation**
    - Try out new packages or versions without affecting existing setups.
5. **Fast Setup**
    - A virtual environment is typically faster than any of the other solutions, such as spinning up a Docker container or a Virtual Machine.

### Downsides of Virtual Environments

There are also downsides to virtual environments.

1. **Still Depends on Host Environment**

    - It doesn't isolate system-level dependencies (e.g., binary tools, compilers).
      For example, even when using `chruby` to select the correct Ruby version for Jekyll, Jekyll still relies on system tools like `git` and `curl`. If they are not installed on the host system, commands such as `bundle install` or fetching theme dependencies can fail, even though the Ruby environment is set up correctly.
    - Still prone to conflicts with global PATH or language engines.
      For example, if your system has a globally installed Jekyll from an older Ruby version earlier in your `PATH`, running `jekyll serve` may invoke the wrong executable instead of the one provided by your current `chruby`-selected Ruby, leading to confusing version and/or dependency errors.
    - When you use multiple virtual environments (for multiple programming languages), your `.bashrc` or `.zshrc` becomes very large.
      This can result in a noticeable delay between opening a terminal window and the prompt showing up.

2. **Not Truly Cross-Platform**

    - Environments might behave differently on Windows vs macOS vs Linux.

3. **Harder to Clean Up System-wide Dependencies**

    - While project dependencies are isolated, the underlying language runtime (Ruby or Python) still comes from the host system. Note that all the versions of the interpreter (Ruby, Python, or Node.js) are still installed globally on your system; the virtual environments simply make one version active and hide the others for that specific environment.
    - You also have to be very diligent about maintaining the virtual environment of each project and create one for each new project. When you copy and paste a command from a Google or some AI tool session, you might accidentally install the package or tool in the global or system-wide configuration.

4. **Limited to Language-Specific Dependencies**

    - You can't isolate other components you need, such as PostgreSQL, Redis, NGINX, etc., as Docker or a Virtual Machine can.

### Most Used Virtual Environments by Language

| Language                  | Common Virtual Env Tools                  | Notes                                                                                 |
| ------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------- |
| **Python**                | `venv`, `virtualenv`, `pipenv`, `poetry`  | `venv` is built-in since Python 3.3; `poetry` is popular for full project management. |
| **Node.js**               | `nvm` (Node Version Manager), `volta`     | Manage Node versions per project. `nvm` + `npm install` per project isolates deps.    |
| **Ruby**                  | `rbenv`, `rvm`, `chruby` + Bundler        | `rbenv` + `bundler` is common. `Gemfile` defines project deps.                        |
| **PHP**                   | `phpenv`, `composer`                      | `composer` handles package isolation. `phpenv` manages PHP versions.                  |
| **Elixir**                | `asdf` (manages versions), Mix (for deps) | `asdf` can manage Elixir + Erlang versions together.                                  |
| **JavaScript (frontend)** | `npm`, `yarn`, `pnpm` workspaces          | Lockfiles and `node_modules` isolate dependencies per project.                        |

You need to repeat similar steps for each programming language you need, and the step of installing the local environment for every project.

For simple projects or projects that stick to one programming language, a virtual environment might be sufficient.

## Virtual Machines (VMs)

At the other end of the spectrum of project environment isolation is the Virtual Machine or VM.
A VM lets you emulate a full operating system (OS) inside your host computer. It's like having an extra computer within your computer. This can even be a different OS than your main computer. For example, if you need to run a Windows-only application on your Mac, you typically use a VM to install Windows so you can install the Windows-only application.

### Popular VM Software for Developers

- **Parallels Desktop**: Commercial, highly optimised for macOS.
- **VMware Fusion**: Professional-grade VM software with broad OS support.
- **VirtualBox**: Free and open-source; less optimised but reliable.
- **UTM**: macOS-native VM solution for Apple Silicon.

With a VM, you get a clean environment that won't interfere with your main system, but it also requires a lot of resources of your computer. The VM simulates a computer; therefore, it requires RAM and disk space, which are taken from the available RAM and disk space of your computer. If you allocate too little RAM to the VM, it will run slowly; if you allocate too much, other applications outside the VM will start to run slowly.

> ## Plan for VMs when buying a computer
> If you plan to use VMs, make sure your computer has plenty of RAM and disk space to accommodate the number of VMs you want to run simultaneously, and consider whether you want to perform other tasks on your computer while a VM is running.
{: .aside}

## Docker-Based Environments 🐳

Docker is a **containerization platform**--a tool that allows you to run software in **isolated, lightweight environments** called **containers**.

Think of a **container** like a **mini virtual machine** that:

- Has its own filesystem
- Runs its own services
- Contains all the dependencies and binaries it needs
- BUT shares the host system's kernel (makes it faster and lighter)

A container doesn't include a full OS (like a VM does). It just contains **your app and exactly what your app needs to run** -- nothing more. So you cannot run Windows in a Docker container on a macOS computer.

### Analogy

Let's use a little analogy to compare the three types of environments, so the differences become more obvious.

Imagine you need to prepare a meal.

- A **virtual environment** is like cooking **inside your kitchen**, but keeping each recipe’s ingredients in separate, labelled containers. You rely entirely on the kitchen’s appliances and setup being compatible.
- A **virtual machine** is building a **separate restaurant** on its own land. Everything, building, utilities, appliances, is self-contained.
- A **Docker container** is a **food truck**.  It brings its own stove, own utensils, and own ingredients. It only relies on your property for power and a place to park.

So a Docker container sits in the middle of a light weight virtual environment and a fully separated VM.

### Docker Lingo

When you dive into Docker, you quickly come across different terms like images, containers, and volumes. Let's explain them so we can use Docker correctly.

A **Docker image** is a blueprint or template for a container. An image is read-only and versioned. It is built once and can be reused many times.

An image contains:

- A base OS layer (e.g. Alpine or Debian)
- System libraries
- Language runtime (Ruby, Node, Python, etc.)
- Your application code (optional)
- Instructions on how to start the app

In our analogy, a Docker image is a recipe or an empty food truck, ready for use.

Although you can perfectly build an image from scratch, chances are high that someone has already solved your problem and made the resulting image available online. Typically, these images can be found in [Docker hub](https://hub.docker.com/). You can use such an image as a base and add your own customisation to it. We won't cover this in this episode, but it might be addressed in a future episode.

Without going too deep into the Docker image techniques for now, one term you might come across is **Docker layer**. A layer is a single instruction in the build of a Docker image. In our food analogy, if an image is a recipe, a layer is a step in that recipe.

A **Docker container** is a running instance of an image. Docker start actually starts a container. In turn, this pulls in the image and executes the layers in the image. Containers are isolated from each other. So, back to our analogy, you can have two food trucks, both identical initially, but one makes French food, and the other makes Asian food, without even knowing about each other's existence.

A container can be easily started, stopped, destroyed, and rebuilt again. This means that any data stored within a container can get lost very easily. That's why we need volumes.

A **Docker volume** is a persistent storage location **outside** a container's lifecycle. This is the place where your project files live.

Back to our analogy, a volume is the pantry where your ingredients are stored. If you keep your pantry separate but easily accessible from your food truck, you can replace or upgrade your food truck without losing the food.

### How Are Containers Used?

Each project or tool you work with --Jekyll, Node.js, PostgreSQL-- can run in its **own isolated container**. This means that you can have multiple versions of the same programming language or tool side by side, without conflicts. So project A uses Ruby 2.7, while project B uses Ruby 3.1. You can even run them side by side without clashes.

And, as long as the image and container persist, you could even build an old project with an outdated version, while you updated your computer in the meantime, and your system Ruby version went from 3.1 to 3.5.

By default, Docker containers have their own **internal** file system. But that's not useful for development--you don't want your code trapped inside a container. So Docker allows you to **bind mount** a folder from your Mac into the container. This is called **volume binding**.

Let's say your project lives at:

```shell
/Users/you/projects/my-jekyll-site
```

When you run Docker, it will mount that folder **into the container**, like:

```shell
/container/workdir/my-jekyll-site
```

This allows you to edit the files locally in VS Code or any other preferred editor. The container sees the live updates and can act on them, while changes persist on your Mac, so they are not lost when the container stops.

Think of it like a Dropbox folder. You're working on the file on your computer (which is called the host). Docker sees and uses the same file inside the container, and any changes sync in both directions, in real time.

You don't lose work when the container is deleted. You can track everything in Git as normal, and you can use your favourite development tools outside Docker.

### Summary of the Concepts

| Concept   | What It Is         | Lifecycle   | Purpose              |
| --------- | ------------------ | ----------- | -------------------- |
| Image     | Blueprint          | Long-lived  | Defines environment   |
| Container | Running instance   | Short-lived | Executes application |
| Volume    | Persistent storage | Independent | Stores data          |

## Final thoughts

While Docker gives you a great isolated environment for your project, you might consider this too much work for the few projects you are involved in. That's fine, and you can stick to a virtual environment.

However, when you work in a team on the same project, like Allison and Bart on PBS, you can share the Docker image and be assured that both use exactly the same setup and configurations. Odd errors and failures because not all team members are on exactly the same version of a tool are gone. And, if ever a Windows-based or Linux-based user wants to contribute, the Docker container can be created on their OS and provide the same environment.
