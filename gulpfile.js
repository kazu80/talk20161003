var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    del         = require('del'),
    sass        = require('gulp-sass'),
    runSequence = require('run-sequence'),
    sourcemaps  = require('gulp-sourcemaps'),
    plumber     = require('gulp-plumber'),
    jQuery      = require("jquery"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
    webpack     = require('gulp-webpack');

gulp.task('build', function (callback) {
    runSequence('clean', 'copy', callback);
});

gulp.task('copy', function () {
    return gulp.src(['app/**/*'])
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(cb) {
    return del(['dist/*'], cb);
});

gulp.task('serve:dist', function() {
    browserSync.init({
                         server: {
                             baseDir: './dist/root'
                         },
                         browser: 'Google Chrome'
                     });
});

gulp.task("start", function () {
    return gulp.src('./app/src/js/main.js')
        .pipe(webpack({
                          cache: true,
                          watch: true,
                          keepalive: true,
                          output: {
                              filename: 'js/[name].js'
                          },
                          devtool: "source-map",
                          module: {
                              loaders: [
                                  {
                                      test: /\.css$/,
                                      loader: ExtractTextPlugin.extract("style-loader","css-loader")
                                  },
                                  {
                                      test: /\.scss$/,
                                      loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
                                  },
                                  { test: /\.svg$/, loader: 'url-loader?mimetype=image/svg+xml' },
                                  { test: /\.(woff|woff2)$/, loader: 'url-loader?mimetype=application/font-woff' },
                                  { test: /\.eot$/, loader: 'url-loader?mimetype=application/font-woff' },
                                  { test: /\.ttf$/, loader: 'url-loader?mimetype=application/font-woff' }
                              ]
                          },
                          plugins: [
                              new ExtractTextPlugin("css/[name].css"),
                              new BrowserSyncPlugin({
                                  server: {
                                      baseDir: './app/root'
                                  },
                                  browser: 'Google Chrome'
                              })
                          ]
                      }))
        .pipe(gulp.dest('./app/root/asset/'));
});
