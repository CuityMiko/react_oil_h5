/**
 * gulp自动化
 */
var gulp = require('gulp');
var zip = require('gulp-zip');
var clean = require('gulp-clean');
var dist = 'dist';

gulp.task('default', [], function () {
    console.log("gulp success");
});

// 生成zip包
gulp.task('zip', ['cleanzip'], function() {
    return gulp.src(dist + '/**')
        .pipe(zip(dist + '.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('cleanzip', function() {
    return gulp.src(dist + '.zip')
        .pipe(clean());
});