const {src, dest, parallel, series} = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const surge = require('gulp-surge');

function cleanTask() {
  return del('dist/');
}

function htmlTask() {
  return src('src/*.html')
    .pipe(dest('dist/'));
}

function stylesTask() {
  return src('src/styles/*.css')
    .pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(concat('all.css'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/styles/'));
}

function scriptTask() {
  return src('src/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/scripts/'));
}

function deployTask () {
  return surge({
    project: './dist',
    domain: 'https://nexbuss.surge.sh'
  })
}

exports.clean = cleanTask;
exports.html = htmlTask;
exports.styles = stylesTask;
exports.scripts = scriptTask;
exports.deploy = deployTask;
exports.default = series( cleanTask, parallel(htmlTask, stylesTask, scriptTask));