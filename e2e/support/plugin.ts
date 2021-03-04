import * as express from "express";

module.exports = (on: any, config: any) => {

    console.log('express')

    const app = express();

    app.use("/", express.static("./app/public"));

    app.get("/", (req:express.Request, res:express.Response) => {
        res.sendFile("index.html", { root: "./app/public" });
    });

    const port = 3335;
    app.listen(port);

    config.baseUrl = `http://0.0.0.0:${port}`;

    return config;
};
