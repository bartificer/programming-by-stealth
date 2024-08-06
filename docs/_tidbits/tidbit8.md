---
title: Interview with jq Maintainer Mattias Wadman
instalment: 8
creators: [bart]
date: 2024-08-06
---
This tidbit is a little unusual — it's an interview with one of the maintainers of the jq project, Mattias Wadman.

## Matching Podcast Episode

TO DO

## Links

You can find out more about Mattias & the various projects he is working on at the links below:

- Follow Mattias on Mastodon: [@wader@fosstodon.org](https://fosstodon.org/@wader)
- [Mattias’ GitHub Profile](https://github.com/wader) which hosts some notable jq-related projects:
  - **fq** for querying binary files with the jq language: [github.com/wader/fq](https://github.com/wader/fq)
    - [A list of presentations about fq — github.com/…](https://github.com/wader/fq?tab=readme-ov-file#presentations)
    - [The fork of the Go version of jq that powers fq — github.com/…](https://github.com/wader/gojq/tree/fq)
  - The language definition file for adding jq support to IDEs like VS Code: [github.com/wader/jq-lsp](https://github.com/wader/jq-lsp)
  - jq implemented in jq: [github.com/wader/jqjq](https://github.com/wader/jqjq)
- Some notable jq commits & files mentioned during the interview:
  - [The very first commit in Haskel](https://github.com/jqlang/jq/commit/eca89acee00faf6e9ef55d84780e6eeddf225e5c)
  - [The switch to C](https://github.com/jqlang/jq/commit/2002dc1a2f4c35478b55149bc1a731e65d9a4268)
  - [jq’s main function which is written in jq — https://github.com/…](https://github.com/wader/fq/blob/master/pkg/interp/init.jq#L159)
- A version of jq implemented in Go: [github.com/itchyny/gojq](https://github.com/itchyny/gojq)
- A version of jq implemented in Rust by Michael Färber: [github.com/01mf02/jaq](https://github.com/01mf02/jaq)
  - [Michael’s formal specification of the jq language — github.com/…](https://github.com/01mf02/jq-lang-spec)
  - The [“Denotational Semantics and a Fast Interpreter for jq”](https://arxiv.org/abs/2302.10576) academic paper by Michael