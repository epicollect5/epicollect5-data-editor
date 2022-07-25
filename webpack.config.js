const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

//Called when building -> (see plugins)
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: APP_DIR + '/index.html', //path.resolve is weird https://goo.gl/6vRELG
    filename: 'index.html',
    inject: false
});

const isProd = process.argv.indexOf('-p') !== -1; //Are we in production?


let plugins = [];

if (isProd) {

    plugins = [

        new webpack.DefinePlugin({//<-- key to reducing React's size
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(), //dedupe similar code
        new webpack.optimize.UglifyJsPlugin(), //minify everything
        new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
        //new BundleAnalyzerPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new Dotenv()
    ];
} else {
    plugins = [
        //copy index.html to .dist/ and append <script src="app.js">
        HTMLWebpackPluginConfig,
        new Dotenv()
    ];
}

//app is served from app/index.html (index.js) in dev -> npm    start, production files will be in ./dist -> npm run build
module.exports = {
    name: 'js',
    entry: {
        'data-editor': [
            'babel-polyfill',
            APP_DIR + '/libraries/libraries.min.js', //libraries entry point
            APP_DIR + '/index.js' //js entry point
            //APP_DIR + '/scss/app.scss', //sass entry point
            //APP_DIR + '/vendor/css/modal.css' //css modal entry point
        ]
    },
    resolve: {
        modulesDirectories: ['src', 'node_modules']//where the import looks for module (avoid ../../../)
    },
    output: {
        filename: 'js/[name].js',
        path: BUILD_DIR
    },
    externals: {
        'ec5-libraries': 'EC5_LIBRARIES'
    },
    devtool: 'source-map', //We need source maps
    devServer: {
        inline: true,
        port: 1122 //server port, change at your pleasure
    },
    module: {
        loaders: [
            //load js and compile (live reload)
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-rest-spread']
                }
            },
            //load css
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            //load sass and compile (live reload)
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }
        ]
    },
    plugins
};
