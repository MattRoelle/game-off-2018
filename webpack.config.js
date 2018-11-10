const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: [/node_modules/, /assets/]
            }
        ]
    },
    resolve: {
        extensions: [ ".ts", ".js" ]
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        contentBase: "./",
        compress: true,
        port: 9000
    },
    devtool: "eval-source-map"
};