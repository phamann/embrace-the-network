var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var runSequence = require('run-sequence');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var swig = require('gulp-swig');
var data = require('gulp-data');
var clean = require('gulp-clean');

var DIST = './dist/';

function getSourceCode(file) {
    var p = (/web-worker/.test(file.path)) ? '/js/worker.js' : '/sw.js';
    return { source: fs.readFileSync(path.dirname(file.path) + p, {encoding:'utf8'}) };
}

gulp.task('html', function() {
    return gulp.src(['./src/**/*.html', '!./src/index.html', '!./src/templates/*'])
            .pipe(data(getSourceCode))
            .pipe(swig())
            .pipe(gulp.dest(DIST));
});

gulp.task('sass', function () {
    gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(DIST + 'css'));
});

gulp.task('js', function(){
    gulp.src('./src/**/*.js')
        .pipe(gulp.dest(DIST));
});

gulp.task('misc', function() {
    gulp.src('./src/index.html')
        .pipe(gulp.dest(DIST));
    gulp.src('./src/css/*.css')
        .pipe(gulp.dest(DIST + 'css'));
    gulp.src('./src/**/css/*.css')
        .pipe(gulp.dest(DIST));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.html', ['html']);
    gulp.watch('./src/scss/**/*.scss', ['sass']);
});

gulp.task('serve', function() {
    gulp.src('./dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

gulp.task('clean', function() {
    gulp.src(DIST + '*', {read: false}).pipe(clean({force: true}));
});

gulp.task('build', function(cb) {
    runSequence('clean', ['html', 'sass', 'js', 'misc'], cb);
});

gulp.task('default', function(){
    runSequence('build', ['serve', 'watch']);
});
