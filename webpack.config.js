
const path = require('path');
const dist = path.resolve('./dist');

const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    devtool: 'source-map',
    entry: path.join(__dirname, '/assets/components/autocomplete/autocomplete.js'),
    output: {
        path: path.resolve(dist, 'js/autocomplete'),
        filename: 'bundle.js'
    },

    module: {
        rules: [

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(?:png|jpg|svg)$/,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'assets/images', to: 'dist/images'}
        ])
    ]
};
