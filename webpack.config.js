var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",

    entry: {
        app: [
            "./src/static/index.js",
            "webpack-hot-middleware/client",
        ]
    },

    output: {
        path: path.resolve(__dirname + "/dist"),
        publicPath: "/",
        filename: "[name].js",
    },

    resolve: {
        extensions: [".js", ".elm"],
        modules: ["node_modules"],
    },

    module: {
        rules: [{
            test: /\.elm$/,
            exclude: [/elm-stuff/, /node_modules/],
            use: [{
                loader: 'elm-hot-loader'
            }, {
                loader: "elm-webpack-loader",
                options: {
                    verbose: true,
                    warn: true,
                    debug: true,
                },
            }],
        }],

        noParse: /\.elm$/
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "src/static/index.html",
            inject: "body",
            filename: "index.html",
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
