'use strict';
const join = require('path').join;
const path = require('path');
const PACKAGE = require('./package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
}
// else if (process.env.NODE_ENV === 'prod') {
//     process.env.NODE_ENV = 'production';
// }

const DEPLOY_PROFILE = process.env.DEPLOY_PROFILE;

const CopyWebpackPlugin = require('copy-webpack-plugin');

const copyFile = {
    production: [
        {from: 'src/static/antd-0.12.15.min.css', to: 'antd.min.css'},
        {from: 'src/static/antd-0.12.15.min.js', to: 'antd.min.js'},
        {from: 'src/static/jquery-2.2.1.min.js', to: 'jquery.min.js'},
        {from: 'src/static/react-15.0.1.min.js', to: 'react.min.js'},
        {from: 'src/static/react-dom-15.0.1.min.js', to: 'react-dom.min.js'},
        {from: 'src/static/react-update-0.14.6.min.js', to: 'react-update.min.js'},
        {from: 'src/static/favicon.ico', to: 'favicon.ico'},
        {from: 'src/static/moment-2.13.0.min.js', to: 'moment.min.js'},
        {from: 'src/static/react-dnd-2.1.4.min.js', to: 'react-dnd.min.js'},
        {from: 'src/static/react-router-2.7.0.min.js', to: 'react-router.min.js'},
        {from: 'dll/dll.min.js', to: 'dll.min.js'},
        {from: 'src/static/duihao.jpg', to: 'duihao.jpg'},
        {from: 'src/static/kulian.jpg', to: 'kulian.jpg'},
        {from: 'src/static/store-icon.png', to: 'store-icon.png'},
        {from: 'src/static/loading.gif', to: 'loading.gif'},
    ],
    development: [
        {from: 'src/static/antd-0.12.15.min.css', to: 'antd.min.css'},
        {from: 'src/static/antd-0.12.15.min.js', to: 'antd.min.js'},
        {from: 'src/static/jquery-2.2.1.min.js', to: 'jquery.min.js'},
        {from: 'src/static/react-development-15.0.1.min.js', to: 'react.min.js'},
        {from: 'src/static/react-dom-development-15.0.1.min.js', to: 'react-dom.min.js'},
        {from: 'src/static/react-update-0.14.6.min.js', to: 'react-update.min.js'},
        {from: 'src/static/favicon.ico', to: 'favicon.ico'},
        {from: 'src/static/moment-2.13.0.min.js', to: 'moment.min.js'},
        {from: 'src/static/react-dnd-2.1.4.min.js', to: 'react-dnd.min.js'},
        {from: 'src/static/react-router-2.7.0.min.js', to: 'react-router.min.js'},
        {from: 'dll/dll.min.js', to: 'dll.min.js'},
        {from: 'src/static/duihao.jpg', to: 'duihao.jpg'},
        {from: 'src/static/kulian.jpg', to: 'kulian.jpg'},
        {from: 'src/static/store-icon.png', to: 'store-icon.png'},
        {from: 'src/static/loading.gif', to: 'loading.gif'},
    ],
};


/*
 * 基于不同模式，区分配置
 * */
const configs = PACKAGE.profiles;

const cfg = ((process.env.NODE_ENV === 'production') ? configs[DEPLOY_PROFILE][process.env.NODE_ENV] : configs.xyg[process.env.NODE_ENV]);

/*
 * 定义entry
 * */
const entry = {
    // "index": ["./src/home/home.jsx", "./src/home/home-content.jsx"],//会合并成一个index.js
    index: './src/entry/index.jsx',
    login: './src/entry/Login.jsx',
    // register: './src/entry/Register.jsx',
    // merchant: './src/entry/Merchant.jsx',
    findpsw: './src/entry/FindPsw.jsx',
    // addinvite: './src/entry/AddInvite.jsx',
};

const alias = {
    'react/lib/ReactTransitionEvents': (0, join)(__dirname, './node_modules/react/lib/ReactTransitionEvents.js'),
    simiditor: join(__dirname, './node_modules/simditor/lib/simditor.js'),
    'es6-promise': join(__dirname, './node_modules/es6-promise/dist/es6-promise.min.js'),
    immutable: join(__dirname, './node_modules/immutable/dist/immutable.min.js'),
    'react-dnd-html5-backend': join(__dirname, './node_modules/react-dnd-html5-backend/dist/ReactDnDHTML5Backend.min.js'),
    'babel-polyfill': join(__dirname, './node_modules/babel-polyfill/dist/polyfill.min.js'),
    'history/lib/createBrowserHistory': join(__dirname, './node_modules/history/lib/createBrowserHistory.js'),
    history: join(__dirname, './node_modules/history/umd/History.min.js'),
    'extract-text-webpack-plugin': join(__dirname, './node_modules/extract-text-webpack-plugin/index.js'),
    'autoprefixer-loader': join(__dirname, './node_modules/autoprefixer-loader/index.js'),
};

/*
 * babel参数
 * */
const babelQuery = {
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['transform-runtime', 'add-module-exports', 'transform-decorators-legacy'],
    cacheDirectory: true,
};

/*
 * webpack配置
 * */
console.log(process.env.NODE_ENV, 9090);

const webpackConfig = {
    /*
     * 指定node_modules目录, 如果项目中存在多个node_modules时,这个很重要.
     * import js或者jsx文件时，可以忽略后缀名
     * */
    node: {
        fs: 'empty',
        npm: 'empty',
        update: 'empty',
    },
    resolve: {
        root: [path.resolve('./src')],
        alias,
        modulesDirectories: ['node_modules', './node_modules', './src/modules'],
        extensions: ['', '.js', '.jsx'],
        unsafeCache: true,
    },
    resolveLoader: {
        modulesDirectories: ['node_modules', './node_modules'],
    },
    devtool: process.env.NODE_ENV !== 'dev' ? false : 'eval',
    /*
     * 入口文件配置
     * */
    entry,
    cache: true,
    // watch: true,
    /*
     * 输出配置
     * path：构建之后的文件存放目录
     * publicPath：js或css等文件，浏览器访问时路径
     * filename：构建之后的文件名
     * */
    hash: true,
    output: {
        path: join(__dirname, cfg.path),
        publicPath: cfg.publicPath,
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:8].min.js', // 非entry，但是需要单独打包出来的文件名配置，添加[chunkhash:8]　防止浏览器缓存不更新．
        libraryTarget: 'var',
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        reactUpdate: 'ReactUpdate',
        antd: 'antd',
        jquery: 'jQuery',
        AMap: 'window.AMap',
        moment: 'moment',
        'react-dnd': 'ReactDnD',
        'react-router': 'ReactRouter',
    },
    devServer: {
        stats: 'errors-only',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: babelQuery,
            }, {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: babelQuery,
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?postcss-loader'),
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css?postcss-loader!less?{"sourceMap":false,"modifyVars":{}}'),
            }, {
                test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                loader: 'url?limit=3000',
            }, {
                test: /\.woff(\?((t=\d+)|(v=\d+\.\d+\.\d+)))?$/,
                loader: 'url?limit=10000&minetype=application/font-woff',
            }, {
                test: /\.woff2(\?((t=\d+)|(v=\d+\.\d+\.\d+)))?$/,
                loader: 'url?limit=10000&minetype=application/font-woff',
            }, {
                test: /\.ttf(\?((t=\d+)|(v=\d+\.\d+\.\d+)))?$/,
                loader: 'url?limit=10000&minetype=application/octet-stream',
            }, {test: /\.eot(\?((t=\d+)|(v=\d+\.\d+\.\d+)))?$/, loader: 'file'}, {
                test: /\.svg(\?((t=\d+)|(v=\d+\.\d+\.\d+)))?$/,
                loader: 'url?limit=10000&minetype=image/svg+xml',
            }, {
                test: /\.(wav|mp3)?$/,
                loader: 'url-loader?limit=8192',
            }, {
                test: /\.md$/,
                loader: 'html!markdown',
            }, {
                test: /\.json?$/,
                loader: 'url-loader?limit=1',
            },
        ],
        noParse: [
            /moment-with-locales/,
        ],
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     context: '.',
        //     manifest: require('./dll/vendor-manifest.json'),
        // }),

        /*
         * 公共文件配置
         * */
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        /*
         * css单独打包成一个css文件
         * 比如entry.js引入了多个less，最终会都打到一个xxx.css中。
         * */
        new ExtractTextPlugin('[name].css', {
            disable: false,
            allChunks: true,
        }),
        // new WebpackMd5Hash(),
        // new ManifestPlugin(),
        // new ChunkManifestPlugin({
        //     filename: 'chunk-manifest.json',
        //     manifestVariable: 'webpackManifest',
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(), // 对id的使用频率和分布来得出最短的id分配给使用频率高的模块
        // new webpack.optimize.DedupePlugin(), // 去重,会导致Cannot read property 'call' of undefined错误
        // new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}), //限制最大分块数
        // new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}), //限制最小分块大小

        // 允许错误不打断程序
        // new webpack.NoErrorsPlugin(),

        // 把指定文件夹xia的文件复制到指定的目录
        new CopyWebpackPlugin(
            (process.env.NODE_ENV === 'dev') ? copyFile.development : copyFile.production
        ),

        /*
         * 这样写法 fetch就可以全局使用了，各个不用单独import
         * */
        new webpack.ProvidePlugin({
            Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
            fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
        }),
    ],
};

if (process.env.NODE_ENV === 'production') {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true,
                drop_console: true,
                pure_funcs: ['console.log'],
            },
            //mangle: {
            //    except: ['$super', '$', 'exports', 'require']
            //},
            mangle: false,
            output: {
                comments: false,
            },
            sourceMap: false,
        })
    );
}

// release 的时候去除console.log函数
let stripStr = '?strip[]=thisjustaplacehoderfunction';

if (process.env.NODE_ENV === 'test') {
    stripStr = '?strip[]=console.log';
    webpackConfig.module.loaders.push({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: `strip-loader${stripStr}`,
    });
    webpackConfig.module.loaders.push({
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: `strip-loader${stripStr}`,
    });
}

module.exports = webpackConfig;
