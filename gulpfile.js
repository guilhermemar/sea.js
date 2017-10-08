/* globals require */
(function gulpfile () {
    'use strict';

    // DEPENDENCIES

    const
        gulp     = require('gulp'),
        clean    = require('gulp-clean'),
        concat   = require('gulp-concat'),
        eslint   = require('gulp-eslint'),
        minify   = require('gulp-minify'),
        sequence = require('run-sequence');

    const
        pack = require('./package.json');

    // AUXILIARY

    const paths = {
        source : ['gulpfile.js', './source/**/*.js'],
        build  : [
            './source/sea.js',
            './source/modules/utils.js',
            './source/modules/params-schema.js',
            './source/modules/utils.js'
        ],
        dist : 'dist'
    };

    // TASKS

    gulp.task('clean', function taskClean () {
        return gulp.src(paths.dist).pipe(clean());
    });

    gulp.task('validate', function validate () {
        return gulp.src(paths.source)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    });

    gulp.task('build', function build () {
        return sequence('clean', 'validate', () => {
            return gulp.src(paths.build)
                .pipe(concat(`sea-${pack.version}.js`))
                .pipe(minify( {ext: {min: '.min.js'}} ))
                .pipe(gulp.dest(paths.dist));
        });
    });

    gulp.task('watch', function taskWatch () {
        gulp.watch(paths.source, ['build']);
    });

    gulp.task('default', ['build']);
})();
