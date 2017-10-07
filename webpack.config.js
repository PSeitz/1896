const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: __dirname + '/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './bundle.js',
        publicPath: '/dist/'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ]
    },
    // module: {
    //     rules: [{
    //         test: /\.js$/,
    //         exclude: /node_modules/,
    //         loader: 'babel-loader',
    //         options: {
    //             presets: [
    //                 ["env", {
    //                     "targets": {
    //                         "browsers": ["last 2 versions", "safari >= 7"]
    //                     }
    //                 }]
    //             ]
    //         }
    //     }]
    // },
    // devServer: {
    //     // contentBase: '/dist/',
    //     hot: true,
    //     inline: true
    // },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    devtool: '#inline-source-map'
};
