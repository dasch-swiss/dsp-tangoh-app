/*
 * Copyright © 2015-2021 the contributors (see Contributors.md).
 *
 * This file is part of Knora.
 *
 * Knora is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Knora is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Knora.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.knora.salsah

import java.io.{ File, PrintWriter }
import java.nio.file.{ Path, Paths }

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.Http.ServerBinding
import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.directives.ContentTypeResolver.Default
import akka.stream.Materializer

import scala.concurrent.{ ExecutionContextExecutor, Future }
import scala.io.Source

object Main extends App {
  implicit val system: ActorSystem = ActorSystem("app-system")
  implicit val materializer: Materializer = Materializer.matFromSystem(system)
  implicit val ec: ExecutionContextExecutor = system.dispatcher

  /**
   * The application's configuration.
   */
  val settings: SettingsImpl = Settings(system)

  val log = akka.event.Logging(system, this.getClass)

  val wherami = System.getProperty("user.dir")
  println(s"user.dir: $wherami")

  val publicDir = if (wherami.contains("bazel")) {
    wherami + "/app/public"
  } else {
    "/app/public"
  }
  println(s"Public Directory: $publicDir")

  val webapiUrl = settings.webapiUrl
  println(s"webapiUrl: $webapiUrl")

  val sipiUrl = settings.sipiUrl
  println(s"sipiUrl: $sipiUrl")

  //create /tmp directory if it does not exist
  val tmpDir = new File("./tmp")
  if (!tmpDir.exists()) {
    tmpDir.mkdir()
  }

  /* rewriting webapi and sipi url in public/js/00_init_javascript.js */
  val originalFile = new File(s"$publicDir/js/00_init_javascript.js") // Original File
  val tempFile = new File("./tmp/00_init_javascript.js") // Temporary File
  val printWriter = new PrintWriter(tempFile)

  val origSource = Source.fromFile(originalFile)("UTF-8")
  origSource.getLines
    .map { line =>
      if (line.contains("http://0.0.0.0:3333")) {
        s"var API_URL = '$webapiUrl';"
      } else if (line.contains("http://0.0.0.0:1024")) {
        s"var SIPI_URL = '$sipiUrl';"
      } else {
        line
      }
    }
    .foreach(x => printWriter.println(x))

  origSource.close()
  printWriter.close()
  tempFile.renameTo(originalFile)

  val (host, port) = (settings.hostName, settings.httpPort)

  val bindingFuture: Future[ServerBinding] = Http().newServerAt(host, port).bind(serveFromPublicDir(publicDir))

  println(s"Server online at http://$host:$port/index.html")

  bindingFuture.failed.foreach { ex =>
    log.error(ex, s"Failed to bind to $host:$port")
  }

  private def serveFromPublicDir(publicDir: String): Route = get {
    entity(as[HttpRequest]) { requestData =>
      val fullPath: Path = requestData.uri.path.toString match {
        case "/" => Paths.get(publicDir + "/index.html")
        case ""  => Paths.get(publicDir + "/index.html")
        case _   => Paths.get(publicDir + requestData.uri.path.toString)
      }

      println(s"${requestData.method} ${requestData.uri} ${requestData.uri.path}")
      getFromFile(fullPath.toString)
    }
  }

  private def getExtensions(fileName: String): String = {

    val index = fileName.lastIndexOf('.')
    if (index != 0) {
      fileName.drop(index + 1)
    } else
      ""
  }
}
