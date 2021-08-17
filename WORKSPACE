workspace(
    name = "com_github_dasch_swiss_dsp_tangoh_app",
    managed_directories = {"@npm": ["node_modules"]},
)


# NOTE(IS): Load external dependencies from deps.bzl.
# Do not put "http_archive" and similar rules into this file. Put them into
# deps.bzl. This allows using this repository as an external workspace.
# (though with the caveat that that user needs to repeat the relevant bits of
#  magic in this file, but at least right versions of external rules are picked).
load("//:deps.bzl", "tangoh_deps")
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_file")

tangoh_deps()


#####################################
# Docker                            #
#####################################

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

# load container_pull method
load(
    "@io_bazel_rules_docker//container:container.bzl",
    "container_pull",
)

# get distroless java
container_pull(
    name = "java_base",
    # 'tag' is also supported, but digest is encouraged for reproducibility.
    digest = "sha256:deadbeef",
    registry = "gcr.io",
    repository = "distroless/java",
)

# get openjdk
container_pull(
    name = "openjdk11",
    digest = "sha256:0e51b455654bd162c485a6a6b5b120cc82db453d9265cc90f0c4fb5d14e2f62e",
    registry = "docker.io",
    repository = "adoptopenjdk",
    tag = "11-jre-hotspot-bionic",
)

#####################################
# Scala                             #
#####################################

# Stores Scala version and other configuration
# 2.12 is a default version, other versions can be use by passing them explicitly:
# scala_config(scala_version = "2.11.12")
load("@io_bazel_rules_scala//:scala_config.bzl", "scala_config")

scala_config(scala_version = "2.13.5")

# register default and our custom scala toolchain
load("@io_bazel_rules_scala//scala:toolchains.bzl", "scala_register_toolchains")

scala_register_toolchains()

register_toolchains("//toolchains:dsp_api_scala_toolchain")

# needed by rules_scala
load("@io_bazel_rules_scala//scala:scala.bzl", "scala_repositories")

scala_repositories()

# register the test toolchain for rules_scala
load("@io_bazel_rules_scala//testing:scalatest.bzl", "scalatest_repositories", "scalatest_toolchain")

scalatest_repositories()

scalatest_toolchain()

#####################################
# Protobuf (Scala Annex)            #
#####################################

load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")

protobuf_deps()

#####################################
# rules_nodejs (javascript)         #
#####################################

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies into your node_modules folder.
# You must still run the package manager to do this.
load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories(
    node_version = "14.15.4",
    package_json = ["//:package.json"],
)

load("@build_bazel_rules_nodejs//:package.bzl", "rules_nodejs_dev_dependencies")

rules_nodejs_dev_dependencies()

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

load("@npm//@bazel/cypress:index.bzl", "cypress_repository")

# The name you pass here names the external repository you can load cypress_web_test from
cypress_repository(name = "cypress")

#####################################
# JAR Dependencies                  #
#####################################
#
# load the dependencies defined in the third_party sub-folder
load("//third_party:dependencies.bzl", "dependencies")

dependencies()

# pin dependencies to the ones stored in maven_install.json in the third_party sub-folder
# to update: bazel run @maven//:pin
load("@maven//:defs.bzl", "pinned_maven_install")

pinned_maven_install()

#####################################
# Twirl templates                   #
#####################################

load("@io_bazel_rules_twirl//:workspace.bzl", "twirl_repositories")

twirl_repositories()

load("@twirl//:defs.bzl", twirl_pinned_maven_install = "pinned_maven_install")

twirl_pinned_maven_install()

#####################################
# Buildifier                        #
#####################################

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains()


#####################################
# rules_pkg - basic packaging rules #
#####################################

# load further dependencies of this rule
load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()
