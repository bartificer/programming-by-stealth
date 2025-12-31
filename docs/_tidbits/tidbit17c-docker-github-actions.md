---
title: Simplifying Developer Setups with Docker - adding GitHub Actions
instalment: 17c
creators: [helma]
date: 2025-12-22
---

Now that we have our local development environment working for the PBS project, wouldn't it be nice if we could also run GitHub actions locally?

## The Problem to Be Solved

In the PBS project, there is a GitHub action setup that runs Vale as a spell checker over all the content files. While it's a nice feature, it's quite tedious to go over to the GitHub site of the repo, find the Actions tab, find the latest output of the `vale-linter` job, look up the typos in the markdown files, fix them, commit, push, and wait for the job to finish and start again.

It would be much easier if we could run the Vale spell check locally and fix multiple typos at once before committing again. Also, locally, the spell check will run much faster because there is no overhead of the environment setup that the GitHub workflow must do.

## Configuring Vale in the Docker Environment

We want to use Vale with the same configuration as the GitHub Action, so it can be run in both environments. We will not go deep into what Vale does; that can be left for another episode. Here, we focus on using Vale in our Docker environment.

## Installing Vale

### Installing Using Make

There are two ways to install Vale: one is in the image, and the other is on demand in the Makefile. For now, we go with the latter to see how it works. Eventually we can add it to the image.

Add the following to the Makefile

```Makefile
lint: ensure-base ## Run Vale linter
	@echo "$(YELLOW)Running Vale linter...$(NC)"
	@docker-compose run --rm \
		-e COLUMNS=${COLUMNS:-300} \
		-w /site \
		jekyll \
		sh -c '\
			if ! command -v vale >/dev/null 2>&1; then \
				echo "Installing Vale..."; \
				wget -q -O /tmp/vale.tar.gz https://github.com/errata-ai/vale/releases/download/v3.0.7/vale_3.0.7_Linux_64-bit.tar.gz && \
				tar -xzf /tmp/vale.tar.gz -C /usr/local/bin && \
				rm /tmp/vale.tar.gz && \
				chmod +x /usr/local/bin/vale; \
			fi && \
			vale --no-wrap --minAlertLevel="${LEVEL:-suggestion}" docs/'
	@echo "$(GREEN)✓ Linting complete$(NC)"
```

With this rule, the script checks inside the container to see if Vale is installed, and if not, it will install Vale and then run Vale on the files in the docs directory.

Now run `make lint` and look at the output. Vale will flag possible typos. 
Here is a snippet of the output.

```
 docs/_tidbits/tidbit11.md
 64:318   error  Did you really mean 'Bashy'?            Vale.Spelling
 ...
 450:42   error  Did you really mean 'writting'?         Vale.Spelling
 478:1    error  Did you really mean 'mand'?             Vale.Spelling
 508:343  error  'that' is repeated!                     Vale.Repetition
...
 585:67   error  Did you really mean 'speically'?        Vale.Spelling
...

 docs/_tidbits/tidbit14.md
 20:222   error  Did you really mean 'cybersecurity'?  Vale.Spelling
 96:213   error  'ever' is repeated!                   Vale.Repetition
 120:151  error  Did you really mean 'hmmm'?           Vale.Spelling
 200:49   error  Did you really mean 'intial'?         Vale.Spelling
```

`intial` and `speically` are probably typos, while `cybersecurity` is just jargon. We can look up the line number in the specified file (line 200 in tidbit14.md for `intial`) and decide if it's a true typo, and fix it, or it is actually jargon. In that case, the word can be added to the `.github/styles/config/vocabularies/PBS/accept.txt` file, and Vale will treat it as correct.

Now run the `make lint` command again, and the number of errors should be less than before. Personally, I find it a joyous game to bring the errors down as much as possible.

### Installing in the Image

Having Vale available locally makes it much more usable. Again, Vale can do much more than spotting typos, but we'll leave that for another time.

The previous setup was relatively easy, but the Make rule is very complicated and not very well maintainable. We can move the actual installation of Vale to the image, so it will also be available for all other projects which focus on a Jekyll based website with narrative content, e.g. Bart's personal website should he decide to move it to Jekyll.

Moving the installation to the image involves several steps:

- put the installation instructions in the Dockerfile
- rebuild the image and container
- clean up the `make lint` rule

Installing Vale in the Docker image means we add the installation instructions to the Dockerfile.

```Dockerfile
FROM ruby:3.3

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install Vale
RUN wget -q -O /tmp/vale.tar.gz https://github.com/errata-ai/vale/releases/download/v3.0.7/vale_3.0.7_Linux_64-bit.tar.gz && \
    tar -xzf /tmp/vale.tar.gz -C /usr/local/bin && \
    rm /tmp/vale.tar.gz && \
    chmod +x /usr/local/bin/vale

# Install bundler
RUN gem install bundler
...
```

The `docker-compose.yml` does not need any changes. So to rebuild the image we simply run

```shell
make rebuild-base
```

Once that finishes, we can simplify the Makefile.

```Makefile
lint: ensure-base ## Run Vale linter
	@echo "$(YELLOW)Running Vale linter...$(NC)"
	@docker-compose run --rm \
		-e COLUMNS=${COLUMNS:-300} \
		-w /site \
		jekyll \
		vale --no-wrap --minAlertLevel="${LEVEL:-suggestion}" docs/
	@echo "$(GREEN)✓ Linting complete$(NC)"
```

With the make rule becoming simpler, we can even add extra rules that help with using Vale.

```Makefile
lint-warnings: ## Run Vale with warning level only
	@$(MAKE) lint LEVEL=warning


lint-errors: ## Run Vale with error level only
	@$(MAKE) lint LEVEL=error


lint-file: ## Lint specific file (usage: make lint-file FILE=docs/page.md)
ifndef FILE
	@echo "$(RED)Error: Please specify FILE=path/to/file$(NC)"
	@echo "Example: make lint-file FILE=docs/_tidbits/tidbits14.md"
else
	@echo "$(YELLOW)Linting $(FILE)...$(NC)"
	@docker-compose run --rm \
		-e COLUMNS=${COLUMNS:-300} \
		-w /site \
		jekyll \
		vale --no-wrap --minAlertLevel="${LEVEL:-suggestion}" $(FILE)
	@echo "$(GREEN)✓ Linting complete$(NC)"
endif
```

## Using Docker in GitHub Actions - Updating the TTT Build Environment

Now that we have a local setup that precisely defines which tools, libraries and configurations we need to produce the output, why not use that in the GitHub actions that also produce that same output? It would simplify maintenance because we only have to add changes to one setup, not two.

This is exactly what we did for the Taming the Terminal project. After a long hiatus Bart and Allison decided to add a new TTT episode, but they were not able to build the website because time moved on and the requirements of the project became incompatible with the currently installed versions of Ruby and the other tools necessary to build the various outputs.

When moving the build script to a Docker setup we could ensure that, even if the various pieces become outdated, we can still run the build and not worry about the conflicting requirements.

Below is the new Dockerfile for the TTT project

```Dockerfile
FROM asciidoctor/docker-asciidoctor:latest

USER root

# Tools needed for the build
RUN apk add --no-cache zip rsync git openjdk17-jre wget unzip vale

# Install hunspell + English GB dictionaries for Vale
RUN apk add --no-cache hunspell hunspell-en

# Install write-good Vale grammar rules inside the container
RUN mkdir -p /opt/vale/styles \
  && curl -sL https://github.com/errata-ai/write-good/releases/latest/download/write-good.zip \
     -o /tmp/write-good.zip \
  && unzip /tmp/write-good.zip -d /opt/vale/styles \
  && rm /tmp/write-good.zip

# Install epubcheck 4.2.6
RUN wget -O /tmp/epubcheck.zip https://github.com/w3c/epubcheck/releases/download/v4.2.6/epubcheck-4.2.6.zip \
    && unzip /tmp/epubcheck.zip -d /opt \
    && mv /opt/epubcheck-4.2.6 /opt/epubcheck \
    && rm /tmp/epubcheck.zip

# Add wrapper script
RUN printf '#!/bin/sh\nexec java -jar /opt/epubcheck/epubcheck.jar "$@"\n' \
      > /usr/local/bin/epubcheck \
    && chmod +x /usr/local/bin/epubcheck

# Install Node.js + npm on Alpine
RUN apk add --no-cache nodejs npm

# Copy package.json for QR code generator
COPY package.json package-lock.json* /workspace/

# Install node dependencies
RUN cd /workspace && npm install
```

Taming the Terminal is written using AsciiDoc and the AsciiDoctor project has conveniently created a Docker image that contains all the necessary requirements to run the build script.

The AsciiDoctor image does not contain Vale, so we added it and we threw some other tools in as well that should make our lives easier. The epubcheck checks the generated epubs for any errors that might prevent the epubs being readable in an epub-reader. 

Every intro section has a QR-code to allow the users to listen to the podcast on a different device. These QR-codes are generated based on the url of audio files. The script to create the QR-codes is written in JavaScript, so node.js is added to the image.

Finally, it's worth mentioning that the project directory inside the container is called 
`/workspace`.

The `docker-compose.yml` file is also relatively short

```yaml
services:
  book-builder:
    build:
      context: .
      dockerfile: Dockerfile
    working_dir: /workspace
    # Default command: run the full book build script
    command: ["sh", "-lc", "./scripts/build-book.sh"]
    volumes:
      # Mount project source into the container
      - .:/workspace
      # Keep node_modules in a Docker volume (not in your repo)
      - node_modules_cache:/workspace/node_modules

volumes:
  node_modules_cache:
```

The service uses the Dockerfile located in the same directory. It mounts the project directory as `/workspace` and it creates a named volume for the `node_modules` directory so our project directory is not cluttered with this directory.

The `command` element calls a shell script called `build-book.sh`. In an attempt to keep the rules in the Makefile short and readable many of the heavy lifting is moved to scripts in the `scripts` directory. Since this directory is also available inside the container, we can quickly fix a bug in one of those scripts without having to rebuild the image or even restart the container.

Coming back to this project after a long time, and of course not being as diligent in documenting as Allison, made it hard to figure out which of the script was the actual build script. That's where Make came to the rescue. 

This time all available actions are neatly documented in the Make file, along with a help rule that helps in remembering what to do.

```Makefile
# Default target
.DEFAULT_GOAL := help

.PHONY: help check check_episodes npm-install build shell lint lint-vale

DOCKER_STAMP := .docker-image.stamp
DOCKER_DEPS  := Dockerfile docker-compose.yml scripts/build-book.sh package.json package-lock.json

# ----------------------------------------------------------
# HELP SYSTEM
# ----------------------------------------------------------
help:  ## Show this help message
	@echo ""
	@echo "Available Make targets:"
	@echo ""
	@awk 'BEGIN { FS=":.*## " } \
		/^[a-zA-Z0-9_-]+:.*## / { \
			names[++n] = $$1; \
			descs[n] = $$2; \
			if (length($$1) > max) max = length($$1); \
		} \
		END { \
			for (i = 1; i <= n; i++) { \
				printf "  %-*s - %s\n", max, names[i], descs[i]; \
			} \
		}' $(MAKEFILE_LIST)
	@echo ""


# ----------------------------------------------------------
# CHECKS
# ----------------------------------------------------------

mp3-files:  ## Regenerate mp3_files from audio macros
	@./scripts/update-mp3_files.py

check: mp3-files check_episodes lint-vale  ## Run all checks (episodes, mp3 files, Vale)

check_episodes:  ## Validate episode list, mp3 list, URL checks, newline normalization
	@./scripts/check_episodes.sh

# ----------------------------------------------------------
# LINTING
# ----------------------------------------------------------
lint: lint-vale  ## Run all linters (currently Vale)
spellcheck: lint-vale ## Run Vale style/spell checker inside Docker (synonym for lint-vale)

lint-vale: lint-vale-error  ## Default: run Vale and show only errors

lint-vale-suggestion: docker-build  ## Vale: show suggestions, warnings, and errors
	@docker compose run --rm book-builder \
	  sh -lc 'scripts/lint-vale.sh suggestion'

lint-vale-warning: docker-build  ## Vale: show warnings and errors
	@docker compose run --rm book-builder \
	  sh -lc 'scripts/lint-vale.sh warning'

lint-vale-error: docker-build  ## Vale: show only errors
	@docker compose run --rm book-builder \
	  sh -lc 'scripts/lint-vale.sh error'

# ----------------------------------------------------------
# PARTIAL BUILDS
# ----------------------------------------------------------

html: docker-build npm-install  ## Build only the HTML version
	@docker compose run --rm book-builder \
	  sh -lc "scripts/build-book.sh html"

pdf: docker-build npm-install  ## Build only PDFs
	@docker compose run --rm book-builder \
	  sh -lc "scripts/build-book.sh pdf"

epub: docker-build npm-install  ## Build only EPUBs
	@docker compose run --rm book-builder \
	  sh -lc 'scripts/build-book.sh epub'

# ----------------------------------------------------------
# FULL BOOK BUILD
# ----------------------------------------------------------
build: npm-install mp3_files  ## Build the full HTML, EPUB, PDF output using build-book.sh inside Docker
	@docker compose run --rm book-builder

# ----------------------------------------------------------
# DOCKER BUILD
# ----------------------------------------------------------

# High-level target used everywhere (local + CI)
docker-build: $(DOCKER_STAMP)  ## Build the Docker image for the book-builder environment (if needed)

# Stamp file: updated when the image is (re)built
$(DOCKER_STAMP): $(DOCKER_DEPS)
	@docker compose build book-builder
	@touch $(DOCKER_STAMP)

# ----------------------------------------------------------
# NODE DEPENDENCIES
# ----------------------------------------------------------
npm-install: docker-build  ## Install Node dependencies inside container using node_modules volume
	@docker compose run --rm book-builder sh -lc 'if command -v npm >/dev/null 2>&1; then (npm ci || npm install); else echo "npm not found in container"; exit 1; fi'

# ----------------------------------------------------------
# INTERACTIVE SHELL
# ----------------------------------------------------------
shell: docker-build  ## Open an interactive shell in the book-builder container
	@docker compose run --rm book-builder sh
```

Working with this new environment made it clear that manually updating the file that is used to create the QR-codes is tedious and close attention to avoid errors. We could as well add the generation of that file to the QR-script.

That action also triggered a cleanup of the directory so the layout of the directory has become much cleaner.

Once everything worked again locally, we had to address the GitHub workflows. The `publish` workflow suffered from similar problems as the local build system. Why not use the same Docker image and Makefile?

So the most relevant steps in the `publishing` workflow went from 

```yaml
...
- name: Setup Ruby
        if: env.GHA_WORK_TO_DO == 1
        uses: actions/setup-ruby@v1
        with:
          ruby-version: "2.7"

- name: Checkout
        if: env.GHA_WORK_TO_DO == 1
        uses: actions/checkout@v2

...
        
- name: Run bundle install
        if: env.GHA_WORK_TO_DO == 1
        run: |
          gem install bundler
          bundle install

- name: Publish the book
        if: env.GHA_WORK_TO_DO == 1
        run: bundle exec rake
...       
```

to

```yaml
...
- name: Checkout
        if: env.GHA_WORK_TO_DO == 1
        uses: actions/checkout@v4
...
- name: Build book via Docker (make build)
        if: env.GHA_WORK_TO_DO == 1
        run: |
          make build
...
```

We can now be sure that the build in the GitHub workflow uses the exact same tools we are using locally and we no longer have to worry that we forget to update the GitHub workflow when we make local changes.

Sure, the build job will take slightly longer because GitHub will have to build the image every time, but that is outweighed by the ease of use. And since this is not be a project that runs this job very frequently, it's not a problem.

For more information on all the moving pieces, head over to the GitHub repository of [Taming the Terminal](https://github.com/bartificer/taming-the-terminal).
