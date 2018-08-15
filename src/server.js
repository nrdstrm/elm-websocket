var http = require("http");
var path = require("path");

var express = require("express");
var webpack = require("webpack");

var webpackConfig = require("../webpack.config");
var compiler = webpack(webpackConfig);

var app = express();

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

http.createServer(app)
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
