---
title: Interview with jq Maintainer Mattias Wadman
instalment: 8
creators: [bart]
date: 2024-08-06
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2024_08_06.mp3
---
This tidbit is a little unusual — it's an interview with one of the maintainers of the jq project, Mattias Wadman.

## Matching Podcast Episode

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2024_08_06.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2024_08_06.mp3" >Download the MP3</a>

Read an unedited, auto-generated transcript with chapter marks:  <a href="https://podfeet.com/transcripts/PBS_2024_08_06.html">PBS_2024_08_06</a>

## Links

You can find out more about Mattias & the various projects he is working on at the links below:

- Follow Mattias on Mastodon: [@wader@fosstodon.org](https://fosstodon.org/@wader)
- [Mattias’ GitHub Profile](https://github.com/wader) which hosts some notable jq-related projects:
  - **fq** for querying binary files with the jq language: [github.com/wader/fq](https://github.com/wader/fq)
    - [A list of presentations about fq — github.com/…](https://github.com/wader/fq?tab=readme-ov-file#presentations)
    - [The fork of the Go version of jq that powers fq — github.com/…](https://github.com/wader/gojq/tree/fq)
  - [fq’s main function which is written in jq — https://github.com/…](https://github.com/wader/fq/blob/master/pkg/interp/init.jq#L159)
  - jq language server (LSP) for IDEs like VS Code, neovim, emacs etc: [github.com/wader/jq-lsp](https://github.com/wader/jq-lsp)
  - jq implemented in jq: [github.com/wader/jqjq](https://github.com/wader/jqjq)
- Some notable jq commits & files mentioned during the interview:
  - [The very first commit in Haskel](https://github.com/jqlang/jq/commit/eca89acee00faf6e9ef55d84780e6eeddf225e5c)
  - [The switch to C](https://github.com/jqlang/jq/commit/2002dc1a2f4c35478b55149bc1a731e65d9a4268)
- A version of jq implemented in Go: [github.com/itchyny/gojq](https://github.com/itchyny/gojq)
- A version of jq implemented in Rust by Michael Färber: [github.com/01mf02/jaq](https://github.com/01mf02/jaq)
  - [Michael’s formal specification of the jq language — github.com/…](https://github.com/01mf02/jq-lang-spec)
  - The [“Denotational Semantics and a Fast Interpreter for jq”](https://arxiv.org/abs/2302.10576) academic paper by Michael
