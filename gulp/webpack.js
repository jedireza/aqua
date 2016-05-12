'use strict';

const Gulp = require('gulp');
const Gutil = require('gulp-util');
const Webpack = require('webpack');


const CommonsChunkPlugin = Webpack.optimize.CommonsChunkPlugin;
const UglifyJsPlugin = Webpack.optimize.UglifyJsPlugin;
let executionCount = 0;


Gulp.task('webpack', (callback) => {

    const config = {
        watch: global.isWatching,
        entry: {
            account: './client/pages/account/index',
            admin: './client/pages/admin/index',
            contact: './client/pages/contact/index',
            login: './client/pages/login/index',
            signup: './client/pages/signup/index'
        },
        output: {
            path: './public/pages',
            filename: '[name].min.js',
            sourceMapFilename: '[name].map.js'
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        module: {
            loaders: [{
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },{
                test: /node_modules\/qs\/.*\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }]
        },
        devtool: 'source-map',
        plugins: [
            new CommonsChunkPlugin('core', '../core.min.js', [], 2)
            // new UglifyJsPlugin({ compress: { warnings: false } })
        ]
    };

    Webpack(config, (err, stats) => {

        if (err) {
            throw new Gutil.PluginError('webpack', err);
        }

        Gutil.log('[webpack]', stats.toString({
            colors: true,
            chunkModules: false
        }));

        if (executionCount === 0) {
            callback();
        }

        executionCount += 1;
    });
});
