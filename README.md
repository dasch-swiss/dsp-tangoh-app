# dsp-tangoh-app
Further development of Salsah 1.5

## Requirements

### For developing and testing

Each developer machine should have the following prerequisites installed:

* Linux or macOS
* Docker Desktop: https://www.docker.com/products/docker-desktop
* Homebrew (on macOS): https://brew.sh

#### JDK Temurin 17

To install, follow these steps:

```shell
$ brew tap homebrew/cask-versions
$ brew install --cask temurin17
```

To pin the version of Java, please add this environment variable to you startup script (bashrc, etc.):

```shell
export JAVA_HOME=`/usr/libexec/java_home -v 17`
```

#### Cypress (E2E Tests)

```shell
$ brew install n # node.js installer
$ n install lts # installs LTS version of node.js and npm
$ npm install -G cypress
```

### For building the documentation

See [docs/Readme.md](docs/Readme.md).

### Coding conventions

Use `camelCase` for names of classes, variables, and functions. Make names descriptive, and don't worry if they're long.

Use whitespace to make your code easier to read.
Add lots of implementation comments describing what your code is doing,
how it works, and why it works that way.

### Documentation

A pull request should include tests and documentation for the changes that were
made.

## Contact information

### Technical

Please use the [DaSCH Discuss Group](https://groups.google.com/a/dasch.swiss/g/discuss) for
technical questions.

### Administrative

Lukas Rosenthaler `<lukas.rosenthaler@unibas.ch>`

## Commit Message Schema

When writing commit messages, we follow the [Conventional Commit messages](https://www.conventionalcommits.org/) rules. Get more information in our official [DSP Contribution Documentation](https://docs.dasch.swiss/developers/dsp/contribution/#git-commit-guidelines)
