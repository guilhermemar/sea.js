/* globals require */
(function gulpfile () {
    'use strict';

    // DEPENDENCIES
    const gulp   = require('gulp'),
        clean    = require('gulp-clean'),
        include  = require('gulp-include'),
        eslint   = require('gulp-eslint'),
        minify   = require('gulp-minify'),
        sequence = require('run-sequence');

    // AUXILIARY
    const paths = {
        source : ['gulpfile.js', './source/**/*.js'],
        build  : ['./source/**/*.js', '!./**/_*'],
        dist   : 'dist'
    };

    // TASKS
    gulp.task('clean', function taskClean (cb) {
        gulp.src(paths.dist).pipe(clean()).on('end', cb);
    });

    gulp.task('validate', function validate (cb) {
        gulp.src(paths.source)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError())
            .on('end', cb);
    });

    gulp.task('build', function build (cb) {
        sequence(['clean', 'validate'], function sequenced () {
            return gulp.src(paths.build)
                .pipe(include())
                .pipe(minify( {ext: {min: '.min.js'}} ))
                .pipe(gulp.dest(paths.dist))
                .on('end', cb);
        });
    });

    gulp.task('watch', function taskWatch () {
        gulp.watch(paths.source, ['build']);
    });

    gulp.task('default', ['build']);
})();
