/*
 * Copyright © 2015-2021 the contributors (see Contributors.md).
 *
 *  This file is part of Knora.
 *
 *  Knora is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Knora is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public
 *  License along with Knora.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express from "express";

module.exports = (on: any, config: any) => {
    const app = express();

    app.get('/', function(req:express.Request, res:express.Response) {
        res.send('<html><body>hello-world</body></html>');
    });

    const port = 3335;
    app.listen(port);

    config.baseUrl = `http://0.0.0.0:${port}`;

    return config;
};
