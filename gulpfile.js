'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var gulpProtractorAngular = require('gulp-angular-protractor');
var exit = require('gulp-exit');

gulp.task('build', function() {
  var tsProject = ts.createProject('tsconfig.json', {
    outFile: './yubinbango.js',
    module: 'none',
    sourceMap: true,
  });

  return gulp
  .src(['yubinbango.ts', 'node_modules/yubinbango-core/yubinbango-core.ts',])
  .pipe(sourcemaps.init())
  .pipe(tsProject())
  .pipe(uglify())
  .pipe(sourcemaps.write('.', { sourceRoot: '.'}))
  .pipe(gulp.dest('.'));
});

gulp.task('webserver', function() {
  return gulp
  .src('./')
  .pipe(webserver({
    hot: 'localhost',
    port: 8888
  }));
});

gulp.task('protractor', function(callback) {
  gulp.src(['test/spec.js'])
    .pipe(gulpProtractorAngular({
      'configFile': 'test/protractor.conf.js',
      'args': ['--baseUrl', 'http://localhost:8888'],
      'debug': false,
      'autoStartStopServer': true
    }))
    .on('error', function(e) { console.log(e); })
    .on('end', function() {
      callback();
    });
});

gulp.task('test', function(callback) {
  runSequence(
    'webserver',
    'protractor',
    function() {
      gulp.src("").pipe(exit());
      callback();
    });
});
