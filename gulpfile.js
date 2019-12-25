// Borrowed heavily from https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a and https://semaphoreci.com/community/tutorials/getting-started-with-gulp-js

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify-es').default,
    concat = require('gulp-concat')

const jsSources = ['src/client/js/*.js'],
    sassSources = ['src/client/sass/**/*.sass'],
    outputDir = 'public'

// Transpile, concatenate and minify scripts
function js() {
  return gulp
    .src(jsSources)
    // .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(outputDir + '/js'))
}

function css() {
  return gulp
    .src(sassSources)
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest(outputDir + '/css'))
}

function buildFiles() {
  js()
  css()
}

function watchFiles() {
  gulp.watch(jsSources, js)
  gulp.watch(sassSources, css)
}

const buildAndWatch = gulp.parallel(buildFiles, watchFiles)

exports.default = buildAndWatch
