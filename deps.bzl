# Copyright (c) 2021 Data and Service Center for the Humanities, DaSCH Service Platform contributors.
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
