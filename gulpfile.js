var port = 8888;
var log = false;
var fs = require('fs');
var gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    usemin      = require('gulp-usemin'),
    connect     = require('gulp-connect'),
    watch       = require('gulp-watch'),
    minify_css  = require('gulp-clean-css'),
    minify_js   = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    less        = require('gulp-less'),
    rename      = require('gulp-rename'),
    minify_html = require('gulp-htmlmin'),
    debug       = require('gulp-debug'),
    pump        = require('pump'),
    babel       = require('gulp-babel'),
    cached      = require('gulp-cached'),
    remember    = require('gulp-remember'),
    ngAnnotate  = require('gulp-ng-annotate'),
    sourcemaps  = require('gulp-sourcemaps'),
    serveStatic = require('serve-static')

var paths = {
    scripts: [
        'src/app/module.js', // Master file
        'src/app/**/index.js', // Individual modules
        'src/app/**/*.js' // Then everything else
    ],
    libs: 'bower_components/openpgp/dist/*.min.js',
    styles: 'src/styles/**/*.*',
    images: 'src/assets/img/*.*',
    templates: 'src/templates/**/*.html',
    main: 'src/*.html',
    fonts: 'bower_components/**/*.{ttf,woff,woff2,eof,svg}'
};

/**
 * Handle bower components from main
 */
gulp.task('usemin', function (cb) {
    pump([
            gulp.src(paths.main)
                .pipe(gulpif(log, debug())),
            sourcemaps.init({debug: log}),
            usemin({
                js: ['concat'],
                css: ['concat'],
            }),
            sourcemaps.write('.'),
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
            gulp.src(paths.fonts)
                .pipe(gulpif(log, debug())),
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
    'custom-libs',
    'custom-js',
    'custom-less',
    'custom-templates'
]);

gulp.task('custom-images', function (cb) {
    pump([
            gulp.src(paths.images)
                .pipe(gulpif(log, debug())),
            gulp.dest('build/img')
        ],
        cb
    );
});

gulp.task('custom-libs', function (cb) {
    pump([
            gulp.src(paths.libs)
                .pipe(gulpif(log, debug())),
            gulp.dest('build/')
        ],
        cb
    );
});

gulp.task('custom-js', function (cb) {
    pump([
            gulp.src(paths.scripts)
                .pipe(gulpif(log, debug())),
            cached(),
            sourcemaps.init(),
            babel({
              presets: ['es2015']
            }),
            remember(),
            ngAnnotate({
                add: true,
                remove: true,
                single_quotes: true
            }),
            concat('dashboard.min.js'),
            sourcemaps.write('./'),
            // minify_js(),
            gulp.dest('build/js')
        ],
        cb
    );
});

gulp.task('custom-less', function (cb) {
    pump([
            gulp.src(paths.styles)
                .pipe(gulpif(log, debug())),
            less(),
            concat('app.css'),
            gulp.dest('build/css')
        ],
        cb
    );
});

gulp.task('custom-templates', function (cb) {
    pump([
            gulp.src(paths.templates)
                .pipe(gulpif(log, debug())),
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
        port: port,
        middleware: function(connect, options, middlewares) {
            var base = __dirname + '/build/' ;
            return [
                serveStatic(base),
                function(req, res, next) {
                    // no file found; send app.html
                    var file = base + 'index.html';
                    if (fs.existsSync(file)) {
                        fs.createReadStream(file).pipe(res);
                        return;
                    }
                    res.statusCode(404);
                    res.end();
                }
            ];
        }
    });
});

gulp.task('livereload', function (cb) {
    pump([
            gulp.src('build/**/*.*')
                .pipe(gulpif(log, debug())),
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
    'watch'
]);
