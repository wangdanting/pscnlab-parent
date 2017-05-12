const join = require('path').join;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const configs = {
    sourcePath: 'src/static/',
    distPath: 'src/static/',
};

const entry = {
    'antd-0.12.15.min': './src/static/antd-0.12.15.min.js',
};

const webpackConfig = {
    /*
     * 入口文件配置
     * */
    entry,
    cache: true,
    output: {
        path: join(__dirname, configs.distPath),
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'es3ify-loader',
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?sourceMap&-restructuring!autoprefixer-loader'),
            },
        ],
    },
};

module.exports = webpackConfig;
