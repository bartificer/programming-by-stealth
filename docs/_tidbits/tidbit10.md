---
title: Run LLMs Locally with Ollama
instalment: 171
creators: [allison]
date: 2024-12-04
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2024_12_21.mp3
---

Steve Mattan joins Allison in a conversation about how he is running large language models locally on his Mac using a variety of open source tools. These shownotes will not be a step-by-step guide but combined with Steve's explanation and the links he provides will give you a bit of a roadmap on how to do it yourself.

## Matching Podcast Episode

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2024_12_21.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2024_12_21.mp3" >Download the MP3</a>

Read an unedited, auto-generated transcript with chapter marks:  <a href="https://podfeet.com/transcripts/PBS_2024_12_21.html">PBS_2024_12_21</a>

## INTRODUCTION

Steve Mattan is a listener to Programming By Stealth who has contributed several fixes and valuable suggestions through GitHub to the project. He also participates in our Slack at <a href="https://podfeet.com/slack">podfeet.com/slack</a> in the Programming By Stealth channel.

Steve has a Bachelor's degree in Physics and a Master's degree in Computer Science, but as soon as he finished his Computer Science degree, the company that paid for it put him into management. That hasn't kept him from playing around with code for fun. He made a post on Slack that was the genesis for our conversation. 

## Steve’s Original Post in Slack

I've recently started learning Python, using the book Python Crash Course, 3e by Eric Matthes. The book recommends using VSCode as an editor and since I wanted to try it out that's what I'm using. And like most people interested in tech, I'm intrigued by LLMs. Alas, as a hobby programmer, I cannot justify a GitHub Copilot subscription.

Unrelated to my learning Python, but related to my interest in LLMs, I had recently started playing with Ollama, a Free and Open Source (FOSS) tool for running LLMs locally. My main Mac is an M1 Max Studio with 64 GB RAM, more than enough to do so. Ollama is a command line tool, but there are GUI front ends available. I'm using Enchanted as a macOS native front end, and use Keyboard Maestro to launch Enchanted when I launch Ollama.

Related to my using VSCode to learn Python and to my use of Ollama is another FOSS tool called Continue. Continue is an extension for VSCode that allows one to use LLMs as a code assistant. Continue works with Ollama. So now Keyboard Maestro launches Ollama (which launches Enchanted) when I launch VSCode.

And I'm having a blast. It is somewhat spooky that Continue is suggesting answers to the exercises in the Python Crash Course via autocomplete as if it is reading the text along with me.

Note that Continue can be used JetBrains in addition to VSCode, and with non-local LLMs, including Claude Sonnet 3.5, Llama 3.1, GPT-4o, and Gemini 1.5.

### Links

* Ollama: [https://ollama.com](https://ollama.com/)
  * Get up and running with large language models.
* Enchanted: https://github.com/AugustDev/enchanted
  * Enchanted is an iOS and macOS app for chatting with private self-hosted language models such as Llama2, Mistral, or Vicuna using Ollama.

* Continue: [https://www.continue.dev](https://www.continue.dev/)
  * Integrate LLMs into VSCode (or Jetbrains)
  * Amplified developers, AI-enhanced development · The leading open-source AI code assistant. You can connect any models and any context to build custom autocomplete and chat experiences inside the IDE

* Python Crash Course: https://nostarch.com/python-crash-course-3rd-edition

* Visual Studio Code: [https://code.visualstudio.com](https://code.visualstudio.com/)
  * Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications. Visual Studio Code is free and available on your favorite platform - Linux, macOS, and Windows.

* Keyboard Maestro: https://www.keyboardmaestro.com/main/
  * Automation tool to launch the apps together

* [Python Crash Course, 3rd Edition from No Starch](https://nostarch.com/python-crash-course-3rd-edition)
  * This fast-paced intro to programming with Python will have you writing code, solving problems, and making cool projects in no time.

## Suggestions from Steve on interacting at the shell:

If you type `ollama` at the zsh prompt in your terminal app of choice you’ll get:

```~ ➤ ollama
% ollama
```

```zsh
% ollama
Usage:
  ollama [flags]
  ollama [command]

Available Commands:
  serve       Start ollama
  create      Create a model from a Modelfile
  show        Show information for a model
  run         Run a model
  stop        Stop a running model
  pull        Pull a model from a registry
  push        Push a model to a registry
  list        List models
  ps          List running models
  cp          Copy a model
  rm          Remove a model
  help        Help about any command

Flags:
  -h, --help      help for ollama
  -v, --version   Show version information

Use "ollama [command] --help" for more information about a command.
```



The `rm` command will remove the model:

```zsh
 % ollama rm llama3.2
deleted 'llama3.2'
```



A useful command not shown in that list is “/bye” which ends the Ollama session and returns you to the shell prompt.

With respect to model sizes, if you navigate to the main ollama page at [ollama.com](http://ollama.com/), and click the “Models” link at the top right, you can search for models. You see that llama3.2 comes in two sizes, 1B and 3B (1 billion and 3 billion parameters respectivley.) Click on the model name, and it will take you to a page where you can copy the `ollama run` command for your selected size. (Note that “latest” does not mean last updated but rather last downloaded.)