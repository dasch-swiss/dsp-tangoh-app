""" Maven dependencies loaded into the workspace """

# docs for rules_jvm_external: https://github.com/bazelbuild/rules_jvm_external
load("@rules_jvm_external//:defs.bzl", "maven_install")
load("@rules_jvm_external//:specs.bzl", "maven")
load("//third_party:versions.bzl", "AKKA_HTTP_VERSION", "AKKA_VERSION", "JENA_VERSION")

def dependencies():
    #
    # e.g., to reference use: @maven//com_typesafe_akka_akka_actor_2_12
    #
    # ATTENTION: Transitive dependencies need to be explicitly added
    # to query: bazel query @maven//:all --output=build
    # or: bazel query @maven//:all | sort
    #
    maven_install(
        artifacts = [
            # akka
            "com.typesafe.akka:akka-actor_2.13:%s" % (AKKA_VERSION),
            "com.typesafe.akka:akka-stream_2.13:%s" % (AKKA_VERSION),
            "com.typesafe.akka:akka-slf4j_2.13:%s" % (AKKA_VERSION),

            # akka http
            "com.typesafe.akka:akka-http_2.13:%s" % (AKKA_HTTP_VERSION),
            "com.typesafe.akka:akka-http-xml_2.13:%s" % (AKKA_HTTP_VERSION),
            "com.typesafe.akka:akka-http-spray-json_2.13:%s" % (AKKA_HTTP_VERSION),
            "com.typesafe.akka:akka-http-jackson_2.13:%s" % (AKKA_HTTP_VERSION),
            "com.typesafe:config:1.3.3",

            # Jena
            "org.apache.jena:apache-jena-libs:%s" % (JENA_VERSION),
            maven.artifact(
                group = "org.apache.jena",
                artifact = "jena-text",
                version = JENA_VERSION,
                exclusions = [
                    "org.slf4j:slf4j-log4j12",
                ],
            ),

            # Logging
            "com.typesafe.scala-logging:scala-logging_2.13:3.9.4",
            "ch.qos.logback:logback-classic:1.2.9",
            "ch.qos.logback:logback-core:1.2.9",
            "org.slf4j:log4j-over-slf4j:1.7.32",
            "org.slf4j:jcl-over-slf4j:1.7.32",
            "org.slf4j:slf4j-api:1.7.32",
            "org.apache.logging.log4j:log4j:2.17.0", # needed by apache-jena-libs. explicitly setting latest version (log4shell) to override the one used by jena.


            # scala stuff
            "org.scala-lang.modules:scala-xml_2.13:1.2.0",
        ],
        repositories = [
            "https://repo.maven.apache.org/maven2",
            "https://maven-central.storage-download.googleapis.com/maven2",
            "https://mirror.bazel.build/repo1.maven.org/maven2",
            "https://jcenter.bintray.com",
            "https://dl.bintray.com/typesafe/maven-releases/",
            "https://maven.google.com",
            "https://repo1.maven.org/maven2",
            "https://central.maven.org/maven2",
        ],
    )
