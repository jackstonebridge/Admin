var port = 8888;

var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minify_css = require('gulp-clean-css'),
    minify_js = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minify_html = require('gulp-htmlmin'),
    debug = require('gulp-debug'),
    pump = require('pump'),
    babel = require('gulp-babel');

var paths = {
    scripts: 'src/app/**/*.*',
    styles: 'src/less/**/*.*',
    images: 'src/img/**/*.*',
    templates: 'src/templates/**/*.html',
    main: 'src/*.html',
    fonts: 'bower_components/**/*.{ttf,woff,eof,svg}'
};

/**
 * Handle bower components from main
 */
gulp.task('usemin', function (cb) {
    pump([
            gulp.src(paths.main),
            usemin({
                js: [minify_js(), 'concat'],
                css: [minify_css({keepSpecialComments: 0}), 'concat'],
            }),
            gulp.dest('build')
        ],
        cb
    );
});

/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-fonts']);

gulp.task('copy-fonts', function (cb) {
    pump([
            gulp.src(paths.fonts),
            rename({
                dirname: '/fonts'
            }),
            gulp.dest('build/lib')
        ],
        cb
    );
});

/**
 * Handle custom files
 */
gulp.task('build-custom', [
    'custom-images',
    'custom-js',
    'custom-less',
    'custom-templates'
]);

gulp.task('custom-images', function (cb) {
    pump([
            gulp.src(paths.images),
            gulp.dest('build/img')
        ],
        cb
    );
});

gulp.task('custom-js', function (cb) {
    pump([
            gulp.src(paths.scripts),
            babel({
              presets: ['es2015']
            }),
            minify_js(),
            concat('dashboard.min.js'),
            gulp.dest('build/js')
        ],
        cb
    );
});

gulp.task('custom-less', function (cb) {
    pump([
            gulp.src(paths.styles),
            less(),
            gulp.dest('build/css')
        ],
        cb
    );
});

gulp.task('custom-templates', function (cb) {
    pump([
            gulp.src(paths.templates),
            minify_html(),
            gulp.dest('build/templates')
        ],
        cb
    );
});

/**
 * Watch custom files
 */
 gulp.task('watch', function() {
     gulp.watch([paths.images], ['custom-images']);
     gulp.watch([paths.styles], ['custom-less']);
     gulp.watch([paths.scripts], ['custom-js']);
     gulp.watch([paths.templates], ['custom-templates']);
     gulp.watch([paths.main], ['usemin']);
});

/**
 * Live reload server
 */
gulp.task('webserver', function() {
    connect.server({
        root: 'build',
        livereload: true,
        port: port
    });
});

gulp.task('livereload', function (cb) {
    pump([
            gulp.src('build/**/*.*'),
            watch('build/**/*.*'),
            connect.reload()
        ],
        cb
    );
});

/**
 * Gulp tasks
 */
gulp.task('build', [
    'usemin',
    'build-assets',
    'build-custom'
]);

gulp.task('default', [
    'build',
    'webserver',
    'livereload',
    'watch']
);
