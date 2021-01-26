# dsp-tangoh-app
Further development of Salsah 1.5

## Requirements

### For developing and testing

Each developer machine should have the following prerequisites installed:

* Linux or macOS
* Docker Desktop: https://www.docker.com/products/docker-desktop
* Homebrew (on macOS): https://brew.sh

#### Java Adoptopenjdk 11

To install, follow these steps:

```shell
brew tap AdoptOpenJDK/openjdk
brew cask install AdoptOpenJDK/openjdk/adoptopenjdk11
```

To pin the version of Java, please add this environment variable to you startup script (bashrc, etc.):

```shell
export JAVA_HOME=`/usr/libexec/java_home -v 11`
```

#### Bazel build tools

To install, follow these steps:

```shell
npm install -g @bazel/bazelisk
```

This will install [bazelisk](https://github.com/bazelbuild/bazelisk) which is
a wrapper to the `bazel` binary. It will, when `bazel` is run on the command line,
automatically install the supported Bazel version, defined in the `.bazelversion`
file in the root of the `knora-api` repository.

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
