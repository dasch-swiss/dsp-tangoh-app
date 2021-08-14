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
# Skylib                            #
#####################################
# 1.0.2 released 2019.10.09 (https://github.com/bazelbuild/bazel-skylib/releases/tag/1.0.2)
skylib_version = "1.0.2"

http_archive(
    name = "bazel_skylib",
    sha256 = "97e70364e9249702246c0e9444bccdc4b847bed1eb03c5a3ece4f83dfe6abc44",
    type = "tar.gz",
    url = "https://github.com/bazelbuild/bazel-skylib/releases/download/{}/bazel-skylib-{}.tar.gz".format(skylib_version, skylib_version),
)

#####################################
# Docker                            #
#####################################

rules_docker_version = "0.17.0"

rules_docker_version_sha256 = "59d5b42ac315e7eadffa944e86e90c2990110a1c8075f1cd145f487e999d22b3"

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = rules_docker_version_sha256,
    strip_prefix = "rules_docker-%s" % rules_docker_version,
    url = "https://github.com/bazelbuild/rules_docker/releases/download/v%s/rules_docker-v%s.tar.gz" % (rules_docker_version, rules_docker_version),
)

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

rules_scala_version = "2b7edf77c153f3fbb882005e0f199f95bd322880"  # 03.06.2021

rules_scala_version_sha256 = "95dae4b4cfc9368999d92a82f270dcdc43d4ca2d472658070b8f90a474855b1a"

http_archive(
    name = "io_bazel_rules_scala",
    sha256 = rules_scala_version_sha256,
    strip_prefix = "rules_scala-%s" % rules_scala_version,
    type = "zip",
    url = "https://github.com/bazelbuild/rules_scala/archive/%s.zip" % rules_scala_version,
)

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

protobuf_tag = "3.12.3"

protobuf_sha256 = "e5265d552e12c1f39c72842fa91d84941726026fa056d914ea6a25cd58d7bbf8"

http_archive(
    name = "com_google_protobuf",
    sha256 = protobuf_sha256,
    strip_prefix = "protobuf-{}".format(protobuf_tag),
    type = "zip",
    url = "https://github.com/protocolbuffers/protobuf/archive/v{}.zip".format(protobuf_tag),
)

load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")

protobuf_deps()

#####################################
# rules_nodejs (javascript)         #
#####################################
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "4a5d654a4ccd4a4c24eca5d319d85a88a650edf119601550c95bf400c8cc897e",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/3.5.1/rules_nodejs-3.5.1.tar.gz"],
)

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies into your node_modules folder.
# You must still run the package manager to do this.
load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories")

node_repositories(
    node_version = "14.15.4",
    package_json = ["//:package.json"],
)

load("@build_bazel_rules_nodejs//:package.bzl", "rules_nodejs_dev_dependencies")

rules_nodejs_dev_dependencies()

load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")

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
# defined in the third_party sub-folder
#
rules_jvm_external_version = "4.0"  # 6.01.2021

rules_jvm_external_version_sha256 = "31701ad93dbfe544d597dbe62c9a1fdd76d81d8a9150c2bf1ecf928ecdf97169"

http_archive(
    name = "rules_jvm_external",
    sha256 = rules_jvm_external_version_sha256,
    strip_prefix = "rules_jvm_external-%s" % rules_jvm_external_version,
    url = "https://github.com/bazelbuild/rules_jvm_external/archive/%s.zip" % rules_jvm_external_version,
)

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
rules_twirl_version = "9ac789845e3a481fe520af57bd47a4261edb684f"  # 20.07.2020

rules_twirl_version_sha256 = "b1698a2a59b76dc9df233314c2a1ca8cee4a0477665cff5eafd36f92057b2044"

http_archive(
    name = "io_bazel_rules_twirl",
    sha256 = rules_twirl_version_sha256,
    strip_prefix = "rules_twirl-%s" % rules_twirl_version,
    type = "zip",
    url = "https://github.com/lucidsoftware/rules_twirl/archive/%s.zip" % rules_twirl_version,
)

load("@io_bazel_rules_twirl//:workspace.bzl", "twirl_repositories")

twirl_repositories()

load("@twirl//:defs.bzl", twirl_pinned_maven_install = "pinned_maven_install")

twirl_pinned_maven_install()

#####################################
# Buildifier                        #
#####################################
# buildifier is written in Go and hence needs rules_go to be built.
# See https://github.com/bazelbuild/rules_go for the up to date setup instructions.
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "d1ffd055969c8f8d431e2d439813e42326961d0942bdf734d2c95dc30c369566",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.24.5/rules_go-v0.24.5.tar.gz",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.24.5/rules_go-v0.24.5.tar.gz",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains()

http_archive(
    name = "bazel_gazelle",
    sha256 = "b85f48fa105c4403326e9525ad2b2cc437babaa6e15a3fc0b1dbab0ab064bc7c",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.22.2/bazel-gazelle-v0.22.2.tar.gz",
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.22.2/bazel-gazelle-v0.22.2.tar.gz",
    ],
)

load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")

# bazel buildtools providing buildifier
http_archive(
    name = "com_github_bazelbuild_buildtools",
    strip_prefix = "buildtools-master",
    url = "https://github.com/bazelbuild/buildtools/archive/master.zip",
)

#####################################
# rules_pkg - basic packaging rules #
#####################################
rules_package_version = "0.2.4"

rules_package_version_sha256 = "4ba8f4ab0ff85f2484287ab06c0d871dcb31cc54d439457d28fd4ae14b18450a"

http_archive(
    name = "rules_pkg",
    sha256 = rules_package_version_sha256,
    url = "https://github.com/bazelbuild/rules_pkg/releases/download/%s/rules_pkg-%s.tar.gz" % (rules_package_version, rules_package_version),
)

# load further dependencies of this rule
load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()

#####################################
# rules_stamp - stamping helper     #
#####################################
http_archive(
    name = "ecosia_rules_stamp",
    sha256 = "36d7ea381bfb2520f9353299b162434b25c77365d3c9e9459195c536da5e837d",
    strip_prefix = "rules_stamp-48d5ef2bc0d93bd65fddddbe02f3ae410e25169d",
    url = "https://github.com/ecosia/rules_stamp/archive/48d5ef2bc0d93bd65fddddbe02f3ae410e25169d.tar.gz",
)
