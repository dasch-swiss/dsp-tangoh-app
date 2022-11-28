import com.typesafe.sbt.SbtNativePackager.autoImport.NativePackagerHelper._
import com.typesafe.sbt.packager.docker.DockerPlugin.autoImport.{Docker, dockerRepository}
import com.typesafe.sbt.packager.docker.{Cmd, ExecCmd}
import org.knora.Dependencies
import sbt.Keys.version

import scala.language.postfixOps
import scala.sys.process.Process

//////////////////////////////////////
// GLOBAL SETTINGS
//////////////////////////////////////

lazy val buildSettings = Dependencies.Versions ++ Seq(
  organization := "org.knora",
  version      := (ThisBuild / version).value
)

lazy val rootBaseDir = ThisBuild / baseDirectory

lazy val root: Project = Project(id = "knora", file("."))
  .aggregate(app)
  .enablePlugins(GitVersioning, GitBranchPrompt)
  .settings(Dependencies.Versions)
  .settings(
    // values set for all sub-projects
    // These are normal sbt settings to configure for release, skip if already defined

    Global / onChangedBuildSource := ReloadOnSourceChanges,
    ThisBuild / licenses          := Seq("AGPL-3.0" -> url("https://opensource.org/licenses/AGPL-3.0")),
    ThisBuild / homepage          := Some(url("https://github.com/dhlab-basel/Knora")),
    ThisBuild / scmInfo := Some(
      ScmInfo(url("https://github.com/dhlab-basel/Knora"), "scm:git:git@github.com:dhlab-basel/Knora.git")
    ),

    // use 'git describe' for deriving the version
    git.useGitDescribe := true,

    // override generated version string because docker hub rejects '+' in tags
    ThisBuild / version ~= (_.replace('+', '-')),

    // use Ctrl-c to stop current task but not quit SBT
    Global / cancelable := true,
    publish / skip      := true
  )

//////////////////////////////////////
// TANGOH (./app)
//////////////////////////////////////

lazy val tangohCommonSettings = Seq(
  name := "dsp-tangoh-app"
)

lazy val app: Project = knoraModule("app")
  .enablePlugins(JavaAppPackaging, DockerPlugin)
  .settings(
    tangohCommonSettings
  )
  .settings(
    Dependencies.salsahLibraryDependencies,
    logLevel   := Level.Info,
    run / fork := true,
    run / javaOptions ++= javaRunOptions,
    Compile / run / mainClass := Some("org.knora.salsah.Main"),
    Test / fork               := true,
    Test / javaOptions ++= javaTestOptions,
    Test / parallelExecution := false,
    /* show full stack traces and test case durations */
    Test / testOptions += Tests.Argument("-oDF")
  )
  .settings( // enable deployment staging with `sbt stage`
    // Skip packageDoc and packageSrc task on stage
    Compile / packageDoc / mappings := Seq(),
    Compile / packageSrc / mappings := Seq(),
    Universal / mappings ++= {
      // copy the public folder
      directory("app/public") ++
        // copy the configuration files to config directory
        // contentOf("salsah1/configs").toMap.mapValues("config/" + _) ++
        // copy configuration files to config directory
        contentOf("app/src/main/resources").toMap.mapValues("config/" + _)
    },
    // add 'config' directory first in the classpath of the start script,
    scriptClasspath := Seq("../config/") ++ scriptClasspath.value,
    // need this here, but why?
    Compile / mainClass := Some("org.knora.salsah.Main"),

    // add dockerCommands used to create the image
    // docker:stage, docker:publishLocal, docker:publish, docker:clean

    Docker / dockerRepository := Some("daschswiss"),
    Docker / packageName      := "dsp-tangoh-app",
    dockerUpdateLatest        := true,
    dockerBaseImage           := "eclipse-temurin:17-jre-focal",
    Docker / maintainer       := "support@dasch.swiss",
    Docker / dockerExposedPorts ++= Seq(3335),
    dockerEnvVars := Map(
      "LANG"                   -> "en_US.UTF-8",
      "JAVA_OPTS"              -> "-Dsun.jnu.encoding=UTF-8 -Dfile.encoding=UTF-8",
      "KNORA_SALSAH1_DEPLOYED" -> "true",
      "KNORA_SALSAH1_WORKDIR"  -> "/app"
    ),
    Docker / defaultLinuxInstallLocation := "/opt/docker",
    // use filterNot to return all items that do NOT meet the criteria
    dockerCommands := dockerCommands.value.filterNot {
      // Remove USER command
      case Cmd("USER", args @ _*) => true

      // don't filter the rest; don't filter out anything that doesn't match a pattern
      case cmd => false
    }
  )

lazy val javaRunOptions = Seq(
  // "-showversion",
  "-Xms256m",
  "-Xmx256m"
  // "-verbose:gc",
  // "-XX:+UseG1GC",
  // "-XX:MaxGCPauseMillis=500"
)

lazy val javaTestOptions = Seq(
  // "-showversion",
  "-Xms512m",
  "-Xmx512m"
  // "-verbose:gc",
  // "-XX:+UseG1GC",
  // "-XX:MaxGCPauseMillis=500",
  // "-XX:MaxMetaspaceSize=4096m"
)

def knoraModule(name: String): Project =
  Project(id = name, base = file(name))
    .settings(buildSettings)
