'use strict';
// Gulp.js configuration
const gulp = require('gulp');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');
const concat = require('gulp-concat');
const deporder = require('gulp-deporder');
const stripdebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const assets = require('postcss-assets');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
// development mode?
const devBuild = (process.env.NODE_ENV !== 'production');
// folders
const folder = {
    src: 'src/',
    build: 'build/'
};

// cервер и автообновление страницы Browsersync
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: folder.build
        },
        notify: false
    });
});

// image processing
gulp.task('images', function () {
    const out = folder.build + 'images/';
    return gulp.src(folder.src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(out));
});

// HTML processing
gulp.task('html', ['images'], function () {
    const out = folder.build;
    const page = gulp.src(folder.src + 'html/**/*').pipe(newer(out));
    // minify production code
    if (!devBuild) {
        page = page.pipe(htmlclean());
    }
    return page.pipe(gulp.dest(out));
});

// JS processing
gulp.task('js', function () {
    const jsbuild = gulp.src(folder.src + 'js/**/*')
        .pipe(deporder())
        .pipe(concat('main.js'));

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug())
            .pipe(uglify());
    }
    return jsbuild.pipe(gulp.dest(folder.build + 'js/'));
});

// CSS processing
gulp.task('css', ['images'], function () {
    const postCssOpts = [
        assets({loadPaths: ['images/']}),
        autoprefixer({browsers: ['last 2 versions', '> 2%']}),
        mqpacker
    ];

    if (!devBuild) {
        postCssOpts.push(cssnano);
    }

    return gulp.src(folder.src + 'scss/main.scss')
        .pipe(sass({
            outputStyle: 'nested',
            imagePath: 'images/',
            precision: 3,
            errLogToConsole: true
        }))
        .pipe(postcss(postCssOpts))
        .pipe(gulp.dest(folder.build + 'css/'));
});

// run all tasks
gulp.task('run', ['html', 'css', 'js']);

// watch for changes
gulp.task('watch', function () {
    browserSync.init({
        server: folder.build
    });

    // html changes
    gulp.watch(folder.src + 'html/**/*', ['html']);
    // javascript changes
    gulp.watch(folder.src + 'js/**/*', ['js']);
    // css changes
    gulp.watch(folder.src + 'scss/**/*', ['css']);
});

// default task
gulp.task('default', ['watch', 'run']);
