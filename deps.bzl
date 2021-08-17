# Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
# SPDX-License-Identifier: Apache-2.0

#
# The dependencies of the dsp-tangoh-app workspace.
# This allows using the this workspace externally
# from another bazel workspace.
#
# For example, another Bazel project can depend on
# targets in the tangoh repository by doing:
# ---
# local_repository(
#   name = "com_github_dasch_swiss_dsp-tangoh_app",
#   path = "/path/to/dsp-tangoh-app"
# )
# load("@com_github_dasch_swiss_dsp_tanhog_app//:deps.bzl", "tangoh_deps")
# tangoh_deps()
# ---
#
# A 3rd-party consumer would also need to register relevant
# toolchains and repositories in order to build targets.
# That is, copy some setup calls from WORKSPACE into the
# other WORKSPACE.
#
# Make sure to reference repository local files with the full
# prefix: @com_github_dasch_swiss_dsp_tanhog_app//..., as these won't
# be resolvable from external workspaces otherwise.

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

rules_scala_version = "2b7edf77c153f3fbb882005e0f199f95bd322880"  # 03.06.2021
rules_scala_sha256 = "95dae4b4cfc9368999d92a82f270dcdc43d4ca2d472658070b8f90a474855b1a"

platforms_version = "0.0.3"
platforms_sha256 = "15b66b5219c03f9e8db34c1ac89c458bb94bfe055186e5505d5c6f09cb38307f"

rules_go_version = "0.24.5"
rules_go_sha256 = "d1ffd055969c8f8d431e2d439813e42326961d0942bdf734d2c95dc30c369566"

buildifier_version = "4.0.1"
buildifier_sha256 = "c28eef4d30ba1a195c6837acf6c75a4034981f5b4002dda3c5aa6e48ce023cf1"

rules_nodejs_version = "3.5.1"
rules_nodejs_sha256 = "4a5d654a4ccd4a4c24eca5d319d85a88a650edf119601550c95bf400c8cc897e"

protobuf_version = "3.12.3"
protobuf_sha256 = "e5265d552e12c1f39c72842fa91d84941726026fa056d914ea6a25cd58d7bbf8"

bazel_gazelle_version = "0.22.2"
bazel_gazelle_sha256 = "b85f48fa105c4403326e9525ad2b2cc437babaa6e15a3fc0b1dbab0ab064bc7c"

rules_jvm_external_version = "4.0"  # 6.01.2021
rules_jvm_external_sha256 = "31701ad93dbfe544d597dbe62c9a1fdd76d81d8a9150c2bf1ecf928ecdf97169"

rules_twirl_version = "9ac789845e3a481fe520af57bd47a4261edb684f"  # 20.07.2020
rules_twirl_sha256 = "b1698a2a59b76dc9df233314c2a1ca8cee4a0477665cff5eafd36f92057b2044"

rules_docker_version = "0.18.0"
rules_docker_sha256 = "5d31ad261b9582515ff52126bf53b954526547a3e26f6c25a9d64c48a31e45ac"

bazel_skylib_version = "1.0.2" # 1.0.2 released 2019.10.09
bazel_skylib_sha256 = "97e70364e9249702246c0e9444bccdc4b847bed1eb03c5a3ece4f83dfe6abc44"

rules_pkg_version = "0.2.4"
rules_pkg_sha256 = "4ba8f4ab0ff85f2484287ab06c0d871dcb31cc54d439457d28fd4ae14b18450a"

ecosia_rules_stamp_version = "48d5ef2bc0d93bd65fddddbe02f3ae410e25169d"
ecosia_rules_stamp_sha256 = "36d7ea381bfb2520f9353299b162434b25c77365d3c9e9459195c536da5e837d"

def tangoh_deps():
    if "platforms" not in native.existing_rules():
        http_archive(
            name = "platforms",
            sha256 = platforms_sha256,
            strip_prefix = "platforms-{}".format(platforms_version),
            urls = ["https://github.com/bazelbuild/platforms/archive/{version}.tar.gz".format(version = platforms_version)],
        )
    
    # buildifier is written in Go and hence needs rules_go to be built.
    # See https://github.com/bazelbuild/rules_go for the up to date setup instructions
    if "io_bazel_rules_go" not in native.existing_rules():
        http_archive(
            name = "io_bazel_rules_go",
            urls = [
                "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v{version}/rules_go-v{version}.tar.gz".format(version = rules_go_version),
                "https://github.com/bazelbuild/rules_go/releases/download/v{version}/rules_go-v{version}.tar.gz".format(version = rules_go_version),
            ],
            sha256 = rules_go_sha256,
        )
    
    if "rules_jvm_external" not in native.existing_rules():
        http_archive(
            name = "rules_jvm_external",
            strip_prefix = "rules_jvm_external-{}".format(rules_jvm_external_version),
            sha256 = rules_jvm_external_sha256,
            url = "https://github.com/bazelbuild/rules_jvm_external/archive/{}.zip".format(rules_jvm_external_version),
        )
    
    if "io_bazel_rules_scala" not in native.existing_rules():
        http_archive(
            name = "io_bazel_rules_scala",
            url = "https://github.com/bazelbuild/rules_scala/archive/%s.zip" % rules_scala_version,
            type = "zip",
            strip_prefix = "rules_scala-%s" % rules_scala_version,
            sha256 = rules_scala_sha256,
        )
    
    # Buildifier.
    # It is written in Go and hence needs rules_go to be available.
    if "com_github_bazelbuild_buildtools" not in native.existing_rules():
        http_archive(
            name = "com_github_bazelbuild_buildtools",
            sha256 = buildifier_sha256,
            strip_prefix = "buildtools-{}".format(buildifier_version),
            url = "https://github.com/bazelbuild/buildtools/archive/{}.tar.gz".format(buildifier_version),
        )
    
    # Fetch rules_nodejs for cypress testing
    if "build_bazel_rules_nodejs" not in native.existing_rules():
        http_archive(
            name = "build_bazel_rules_nodejs",
            urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/{}/rules_nodejs-{}.tar.gz".format(rules_nodejs_version, rules_nodejs_version)],
            sha256 = rules_nodejs_sha256,
        )
    
    if "com_google_protobuf" not in native.existing_rules():
        http_archive(
            name = "com_google_protobuf",
            sha256 = protobuf_sha256,
            strip_prefix = "protobuf-{}".format(protobuf_version),
            type = "zip",
            url = "https://github.com/protocolbuffers/protobuf/archive/v{}.zip".format(protobuf_version),
        )

    if "bazel_gazelle" not in native.existing_rules():
        http_archive(
            name = "bazel_gazelle",
            sha256 = bazel_gazelle_sha256,
            urls = [
                "https://storage.googleapis.com/bazel-mirror/github.com/bazelbuild/bazel-gazelle/releases/download/v{}/bazel-gazelle-v{}.tar.gz".format(bazel_gazelle_version, bazel_gazelle_version),
                "https://github.com/bazelbuild/bazel-gazelle/releases/download/v{}/bazel-gazelle-v{}.tar.gz".format(bazel_gazelle_version, bazel_gazelle_version),
            ],
        )

    if "io_bazel_rules_twirl" not in native.existing_rules():
        http_archive(
            name = "io_bazel_rules_twirl",
            sha256 = rules_twirl_sha256,
            strip_prefix = "rules_twirl-%s" % rules_twirl_version,
            type = "zip",
            url = "https://github.com/lucidsoftware/rules_twirl/archive/%s.zip" % rules_twirl_version,
        )

    if "io_bazel_rules_docker" not in native.existing_rules():
        http_archive(
            name = "io_bazel_rules_docker",
            sha256 = rules_docker_sha256,
            strip_prefix = "rules_docker-{}".format(rules_docker_version),
            url = "https://github.com/bazelbuild/rules_docker/releases/download/v{}/rules_docker-v{}.tar.gz".format(rules_docker_version, rules_docker_version),
        )

    if "bazel_skylib" not in native.existing_rules():
        http_archive(
            name = "bazel_skylib",
            sha256 = bazel_skylib_sha256,
            type = "tar.gz",
            url = "https://github.com/bazelbuild/bazel-skylib/releases/download/{}/bazel-skylib-{}.tar.gz".format(bazel_skylib_version, bazel_skylib_version),
        )

    # basic packaging rules
    if "rules_pkg" not in native.existing_rules():
        http_archive(
            name = "rules_pkg",
            sha256 = rules_pkg_sha256,
            type = "tar.gz",
            url = "https://github.com/bazelbuild/rules_pkg/releases/download/{}/rules_pkg-{}.tar.gz".format(rules_pkg_version, rules_pkg_version),
        )
    
    # stamping helper
    if "ecosia_rules_stamp" not in native.existing_rules():
        http_archive(
            name = "ecosia_rules_stamp",
            sha256 = ecosia_rules_stamp_sha256,
            strip_prefix = "rules_stamp-{}".format(ecosia_rules_stamp_version),
            url = "https://github.com/ecosia/rules_stamp/archive/{}.tar.gz".format(ecosia_rules_stamp_version),
        )
