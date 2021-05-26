# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
# THIS_FILE := $(lastword $(MAKEFILE_LIST))
THIS_FILE := $(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

include vars.mk

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
	cp version.txt app/public/app/
	@bazel build //...

.PHONY: run
run: ## run app
	cp version.txt app/public/app/
	@bazel run //app

.PHONY: yarn
yarn: ## install dependencies
	@bazel run @nodejs//:yarn

.PHONY: cypress-install
cypress-install: yarn ## install dependencies
	@bazel run @npm//cypress/cypress:bin -- install

#################################
# Docker targets
#################################

.PHONY: docker-run
docker-run: ## run Tangoh docker image locally
	cp version.txt app/public/app/
	@bazel run //docker

.PHONY: docker-build
docker-build: ## build and publish Tangoh docker image locally
	cp version.txt app/public/app/
	@bazel run //docker -- --norun

.PHONY: docker-publish
docker-publish: ## publish Tangoh image to Dockerhub
	cp version.txt app/public/app/
	@bazel run //docker:push

#################################
# Integration test targets
#################################

# Clones the knora-api git repository
.PHONY: dsp-stack-clone
dsp-stack-clone:
	@git clone --branch main --single-branch --depth 1 https://github.com/dasch-swiss/dsp-api.git $(CURRENT_DIR)/.tmp/dsp-stack

.PHONY: dsp-stack-run
dsp-stack-run: dsp-stack-clone ## runs the dsp-stack
	$(MAKE) -C $(CURRENT_DIR)/.tmp/dsp-stack init-db-test
	$(MAKE) -C $(CURRENT_DIR)/.tmp/dsp-stack stack-up
	$(MAKE) -C $(CURRENT_DIR)/.tmp/dsp-stack stack-logs-api-no-follow

#################################
## Test Targets
#################################

.PHONY: test-docker
test-docker: yarn ## runs Docker image tests
	bazel test //docker/...

.PHONY: test-app
test-app: yarn ## runs all app tests (requires a running dsp-stack).
	bazel test //e2e/...

.PHONY: test
test: yarn ## runs all test targets (requires a running dsp-stack).
	bazel test //...

.PHONY: test-e2e
test-e2e: yarn dsp-stack-clone dsp-stack-run  ## runs all test targets and starts a dsp-stack.
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
