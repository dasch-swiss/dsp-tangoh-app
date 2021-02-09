# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
# THIS_FILE := $(lastword $(MAKEFILE_LIST))
THIS_FILE := $(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

include vars.mk

#################################
# Integration test targets
#################################

# Clones the knora-api git repository
.PHONY: clone-knora-stack
clone-knora-stack:
	@git clone --branch $(API_VERSION) --single-branch --depth 1 https://github.com/dasch-swiss/knora-api.git $(CURRENT_DIR)/.tmp/knora-stack

.PHONY: knora-stack
knora-stack: ## runs the knora-stack
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack init-db-test
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-up
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-logs-api-no-follow

.PHONY: e2e-prepare
e2e-prepare: clone-knora-stack knora-stack run ## prepares the e2e tests

#################################
# Documentation targets
#################################

.PHONY: docs-publish
docs-publish: ## build and publish docs to Github Pages
	@$(MAKE) -C docs docs-publish

.PHONY: docs-build
docs-build: ## build docs into the local 'site' folder
	@$(MAKE) -C docs docs-build

.PHONY: docs-serve
docs-serve: ## serve docs for local viewing
	@$(MAKE) -C docs docs-serve

.PHONY: docs-install-requirements
docs-install-requirements: ## install requirements
	@$(MAKE) -C docs docs-install-requirements

.PHONY: docs-clean
docs-clean: ## cleans the project directory
	@$(MAKE) -C docs docs-clean

#################################
# Bazel targets
#################################

.PHONY: build
build: ## build all targets (excluding docs)
	@bazel build //...

.PHONY: run
run: ## run app
	@bazel run //app

#################################
# Docker targets
#################################

.PHONY: docker-run
docker-run: ## run Tangoh docker image locally
	@bazel run //docker

.PHONY: docker-build
docker-build: ## build and publish Tangoh docker image locally
	@bazel run //docker -- --norun

.PHONY: docker-publish
docker-publish: ## publish Tangoh image to Dockerhub
	@bazel run //docker:push

#################################
## Test Targets
#################################

.PHONY: test-docker
test-docker: docker-build ## runs Docker image tests
	bazel test //docker/...

.PHONY: test-app
test-webapi: docker-build ## runs all app tests.
	bazel test //app/...

.PHONY: test
test: docker-build ## runs all test targets.
	bazel test //...

#################################
## Other
#################################

clean-docker: ## cleans the docker installation
	@docker system prune -af

.PHONY: clean-local-tmp
clean-local-tmp:
	@rm -rf .tmp
	@mkdir .tmp

clean: docs-clean clean-local-tmp clean-docker ## clean build artifacts
	@rm -rf .env
	@bazel clean

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
