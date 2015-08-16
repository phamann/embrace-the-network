var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('server', function() {
    gulp.src('./src/timeouts')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

gulp.task('default', ['server']);
