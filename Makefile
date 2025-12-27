.PHONY: help rebuild-base ensure-base up down restart logs shell install update-gems clean clean-all status serve serve-drafts

# Load environment variables from .env
include .env
export

# Default Dockerfile location if not set in .env
DOCKERFILE_PATH ?= ~/docker-images/jekyll-github-pages/Dockerfile

# Extract directory from Dockerfile path
DOCKERFILE_DIR := $(dir $(DOCKERFILE_PATH))

# Colors
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
RED    := \033[0;31m
NC     := \033[0m

help: ## Show this help message
	@echo "$(GREEN)Jekyll Docker Commands for $(COMPOSE_PROJECT_NAME)$(NC)"
	@echo ""
	@echo "$(BLUE)Configuration (from .env):$(NC)"
	@echo "  Project:     $(COMPOSE_PROJECT_NAME)"
	@echo "  Container:   $(CONTAINER_NAME)"
	@echo "  Dockerfile:  $(DOCKERFILE_PATH)"
	@echo "  Jekyll URL:  http://localhost:$(JEKYLL_PORT)"
	@echo "  LiveReload:  http://localhost:$(LIVERELOAD_PORT)"
	@echo ""
	@echo "Available commands:"
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		sort | \
		awk 'BEGIN {FS = ":"}; {split($$2,a,"## "); printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, a[2]}'

rebuild-base: ## Rebuild base image from Dockerfile
	@echo "$(YELLOW)Rebuilding base image from $(DOCKERFILE_PATH)...$(NC)"
	@if [ -f "$(DOCKERFILE_PATH)" ]; then \
		if [ "$(VERBOSE)" = "1" ]; then \
			cd $(DOCKERFILE_DIR) && docker build -f $(DOCKERFILE_PATH) -t $(BASE_IMAGE) .; \
		else \
			cd $(DOCKERFILE_DIR) && docker build -f $(DOCKERFILE_PATH) -t $(BASE_IMAGE) . > /dev/null 2>&1 || \
			(echo "$(YELLOW)Build failed, showing output:$(NC)" && \
			 cd $(DOCKERFILE_DIR) && docker build -f $(DOCKERFILE_PATH) -t $(BASE_IMAGE) .); \
		fi; \
		echo "$(GREEN)✓ Base image rebuilt: $(BASE_IMAGE)$(NC)"; \
	else \
		echo "$(RED)Error: Dockerfile not found at $(DOCKERFILE_PATH)$(NC)"; \
		exit 1; \
	fi

ensure-base: ## Ensure base image exists (builds if missing)
	@if [ -z "$$(docker images -q $(BASE_IMAGE) 2>/dev/null)" ]; then \
		echo "$(YELLOW)Base image $(BASE_IMAGE) not found. Building...$(NC)"; \
		$(MAKE) rebuild-base; \
	fi

up: ensure-base ## Start Jekyll server
	@echo "$(GREEN)Starting Jekyll server for $(COMPOSE_PROJECT_NAME)...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Server started at http://localhost:$(JEKYLL_PORT)$(NC)"
	@echo "$(BLUE)Tip: Use 'make logs' to see output$(NC)"

down: ## Stop Jekyll server
	@echo "$(YELLOW)Stopping Jekyll server...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Server stopped$(NC)"

restart: down up ## Restart Jekyll server

lint: ensure-base ## Run Vale linter (LEVEL=suggestion COLUMNS=300)
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

lint-warnings: ## Run Vale with warning level only
	@$(MAKE) lint LEVEL=warning

lint-errors: ## Run Vale with error level only
	@$(MAKE) lint LEVEL=error

lint-file: ## Lint specific file (make lint-file FILE=docs/page.md)
ifndef FILE
	@echo "$(RED)Error: Please specify FILE=path/to/file$(NC)"
	@echo "Example: make lint-file FILE=docs/_posts/2024-01-01-post.md"
else
	@echo "$(YELLOW)Linting $(FILE)...$(NC)"
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
			vale --no-wrap --minAlertLevel="${LEVEL:-suggestion}" $(FILE)'
endif

serve: ensure-base ## Start Jekyll in foreground (with logs)
	@echo "$(GREEN)Starting Jekyll server in foreground...$(NC)"
	@echo "$(BLUE)Press Ctrl+C to stop$(NC)"
	@docker-compose up

serve-drafts: ensure-base ## Start Jekyll in foreground with drafts included
	@echo "$(GREEN)Starting Jekyll server with drafts in foreground...$(NC)"
	@echo "$(BLUE)Press Ctrl+C to stop$(NC)"
	@docker-compose run --rm --service-ports jekyll bundle exec jekyll serve --host 0.0.0.0 --livereload --force_polling --drafts

logs: ## Show Jekyll server logs (follow)
	@docker-compose logs -f jekyll

logs-tail: ## Show last 50 lines of logs
	@docker-compose logs --tail=50 jekyll

status: ## Show container status
	@echo "$(BLUE)Container Status:$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(BLUE)Volume Status:$(NC)"
	@docker volume ls | grep "$(COMPOSE_PROJECT_NAME)" || echo "No volumes found"

shell: ## Open bash shell in container
	@echo "$(BLUE)Opening shell in $(CONTAINER_NAME)...$(NC)"
	@docker-compose exec jekyll bash || docker-compose run --rm jekyll bash

install: ensure-base ## Install/update gems from Gemfile
	@echo "$(YELLOW)Installing gems for $(COMPOSE_PROJECT_NAME)...$(NC)"
	@docker-compose run --rm jekyll bundle install
	@echo "$(GREEN)✓ Gems installed$(NC)"

update-gems: ensure-base ## Update all gems to latest versions
	@echo "$(YELLOW)Updating all gems...$(NC)"
	@docker-compose run --rm jekyll bundle update
	@echo "$(GREEN)✓ Gems updated$(NC)"
	@echo "$(BLUE)Consider committing the updated Gemfile.lock$(NC)"

check-gems: ensure-base ## Check if gems are installed and up to date
	@echo "$(BLUE)Checking gem status...$(NC)"
	@docker-compose run --rm jekyll bundle check && \
		echo "$(GREEN)✓ All gems are installed and up to date$(NC)" || \
		echo "$(YELLOW)⚠ Some gems need to be installed. Run 'make install'$(NC)"

add-gem: ensure-base ## Add a gem (usage: make add-gem GEM=gem-name)
ifndef GEM
	@echo "$(RED)Error: Please specify GEM=gem-name$(NC)"
	@echo "Example: make add-gem GEM=jekyll-seo-tag"
else
	@echo "$(YELLOW)Adding gem: $(GEM)$(NC)"
	@docker-compose run --rm jekyll bundle add $(GEM)
	@echo "$(GREEN)✓ Gem added. Restart server with 'make restart'$(NC)"
endif

clean: ## Stop server and remove containers (keeps gems)
	@echo "$(YELLOW)Cleaning up containers...$(NC)"
	@docker-compose down
	@rm -rf docs/_site docs/.jekyll-cache docs/.jekyll-metadata
	@echo "$(GREEN)✓ Containers and generated files removed$(NC)"
	@echo "$(BLUE)Gems are preserved in volume$(NC)"

clean-all: ## Remove everything including gem cache
	@echo "$(RED)⚠ This will remove all gems and require reinstall!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(YELLOW)Removing containers and volumes...$(NC)"; \
		docker-compose down -v; \
		rm -rf docs/_site docs/.jekyll-cache docs/.jekyll-metadata; \
		echo "$(GREEN)✓ Everything removed$(NC)"; \
	else \
		echo "$(BLUE)Cancelled$(NC)"; \
	fi

# Default target
.DEFAULT_GOAL := help