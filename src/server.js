const http = require("http");
const path = require("path");

const express = require("express");
const WebSocket = require("ws").Server;

const webpack = require("webpack");
const webpackConfig = require("../webpack.config");
const compiler = webpack(webpackConfig);

const app = express();

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
}));

app.use(require("webpack-hot-middleware")(compiler));

app.get("/", function (_request, response) {
    response.sendFile(path.join(__dirname, "dist", "index.html"));
});

var port = process.env.PORT || "3000";

app.set("port", port);

const server = http.createServer(app)
    .listen(port, function () {
        console.log(`server started`);
    })
    .on("error", function (error) {
        console.log(`error`, error);
    })
    .on("close", function () {
        console.log(`connection closed`);
    })
    .on("connection", function () {
        console.log(`connection opened`);
    });

const socket = new WebSocket({
    server,
    path: "/server",
});

socket.on("connection", (ws) => {

    ws.on("message", (msg) => {
        ws.send(`bounce -> ${msg}`);
    });

    ws.send("connected");
});
