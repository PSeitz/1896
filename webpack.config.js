module.exports = {
    entry: __dirname + '/main.js',
    output: {
        path: __dirname + '/dist',
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              presets: [
                  ["env", {
                    "targets": {
                      "browsers": ["last 2 versions", "safari >= 7"]
                    }
                  }]
              ]
            }
        }]
    },
    devtool: '#inline-source-map'
};
