/**
 * gulpfile.js
 * Automated Gulp process with linters, uglification, minification, browsersync.
 * Have a nice day.
 *
 * -- Instructions
 * Existing tasks is "build" and "dev".
 * "gulp build" will build all resources including external assets.
 * Run "gulp build" before "gulp dev" which only build project assets.
 * "gulp dev" also run "watch" including BrowserSync.
 *
 * On deployment run "gulp build --production" to minify and uglify.
 *
 *
 * @version 0.3
 * @author  David Kangas, Elicit AB.
 * @updated 2017-10-13
 */

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    sassLint = require('gulp-sass-lint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    util = require('gulp-util'),
    merge = require('merge-stream'),
    imagemin = require('gulp-imagemin'),
    fontmin = require('gulp-fontmin'),
    browserSync = require('browser-sync').create();


//Customize below!!
var config = {
    //Directory with all your assets
    assetsDir: '../resources/assets/',
    //node_modules directory
    nodeDir: 'node_modules/',
    //Your project specific source code.
    sourceDir: '',
    //Directory where all built code will be placed
    distDir: '../public/',
    //styles directory.
    stylesDir: 'css/',
    //javascript directory.
    jsDir: 'js/',
    //image directory.
    imgDir: 'img/',
    //fonts directory.
    fontDir: 'fonts/',
    //Your project specific styles.
    stylesPattern: 'css/**/*.scss',
    //Your project specific js.
    jsPattern: 'js/**/*.js',
    //Fonts pattern
    fontsPattern: '**/*.{ttf,woff,otf,eot,svg,woff2}',
    //Your images.
    imgPattern: 'img/**/*.{png,jpg,jpeg,gif,svg}',
    //flag for detecting "--production" in terminal, don't edit!
    production: !!util.env.production
};

//Add your assets here.
var externalJs = [
    //jQuery
    config.nodeDir + 'jquery/dist/jquery.min.js',
    //Bootstrap
    config.nodeDir + 'bootstrap/dist/js/bootstrap.min.js',
    //AdminLTE
    config.nodeDir + 'admin-lte/dist/js/adminlte.js'
];

//Add your assets here.
var externalSass = [
];

//Add your assets here.
var externalCss = [
    //Bootstrap
    config.nodeDir + 'bootstrap/dist/css/bootstrap.css',
    config.nodeDir + 'bootstrap/dist/css/bootstrap-theme.css',
    //config.nodeDir +  'admin-lte/bootstrap/css/bootstrap.min.css',
    //config.nodeDir +  'admin-lte/bootstrap/css/bootstrap-theme.min.css',
    //AdminLTE
    config.nodeDir + 'admin-lte/dist/css/AdminLTE.css',
    config.nodeDir + 'admin-lte/dist/css/skins/skin-blue-light.min.css',
    //FontAwesome
    config.nodeDir + 'font-awesome/css/font-awesome.min.css'
];

var plumberErrorHandler = { errorHandler: notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
    })
};

//See BrowserSync webpage for options.
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "afrikaswish.app",
        open: "local"
        //tunnel: "digiflow"
    });
});

//// Project specific assets
//Styles.
gulp.task('styles', function () {
    return gulp.src(config.assetsDir + config.sourceDir + config.stylesPattern)
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat('app.scss'))
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sass())
        .pipe(gulp.dest(config.distDir + config.stylesDir))
        .pipe(browserSync.stream());
});

//Javascript
gulp.task('js', function() {
    return gulp.src(config.assetsDir + config.sourceDir + config.jsPattern)
        .pipe(plumber(plumberErrorHandler))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.distDir + config.jsDir))
        .pipe(config.production ? uglify() : util.noop())
        .pipe(gulp.dest(config.distDir + config.jsDir));
});

//Images
gulp.task('img', function() {
    return gulp.src(config.assetsDir + config.sourceDir + config.imgPattern)
        .pipe(plumber(plumberErrorHandler))
        .pipe(imagemin())
        .pipe(gulp.dest(config.distDir + config.imgDir))
});
//// END Project specific assets

//// External assets
//Javascript
gulp.task('jsExternal', function() {
    return gulp.src(externalJs)
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat('external.js'))
        .pipe(gulp.dest(config.distDir + config.jsDir))
        .pipe(config.production ? uglify() : util.noop())
        .pipe(gulp.dest(config.distDir + config.jsDir));
});

//Styles.
// Do not edit here if adding new resources, edit the assets!
// (If using Less download gulp-less and include as lessStream)
gulp.task('stylesExternal', function() {

    var scssStream = gulp.src( externalSass )
        .pipe(plumber(plumberErrorHandler))
        .pipe(sass())
        .pipe(concat('scss-external.scss'))
    ;

    var cssStream = gulp.src(externalCss)
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat('css-external.css'))
    ;

    var mergedStream = merge(scssStream, cssStream)
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat('external.css'))
        .pipe(config.production ? cleancss() : util.noop())
        .pipe(gulp.dest(config.distDir + config.stylesDir));

    return mergedStream;
});

//Fonts
gulp.task('fonts', function () {
    return gulp.src(config.assetsDir + config.sourceDir + config.fontDir + config.fontsPattern)
        .pipe(gulp.dest(config.distDir + config.fontDir));
});
//// END External assets

//Watch changes in js, styles and images
gulp.task('watch', function() {
    gulp.watch(config.assetsDir + config.sourceDir + config.stylesPattern, ['styles'])
        .on('change', browserSync.reload);
    gulp.watch(config.assetsDir + config.sourceDir + config.jsPattern, ['js'])
        .on('change', browserSync.reload);
    gulp.watch(config.assetsDir + config.sourceDir + config.imgPattern, ['img'])
        .on('change', browserSync.reload);
});

//Test task for development of the gulpfile
//Use it with passion!
gulp.task('test', function() {
    console.log(util.env.production);
});

//Default task inactivated to prevent mistakes. Return informational message.
gulp.task('default', function() {
    console.log("\n\n Please run 'gulp dev' or 'gulp build'. Adding '--production' will minify JS. \n\n");
});

//Task for development. Will run watch and browsersync. Will not build external assets.
gulp.task('dev', ['styles', 'js', 'browser-sync', 'watch', 'img']);

//Task for building all assets. Needed first time to build external before running "dev".
// For deployment add --production for minification.
gulp.task('build', ['styles', 'stylesExternal' , 'js', 'jsExternal', 'img', 'fonts']);
