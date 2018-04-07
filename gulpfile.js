let gulp = require('gulp');
let babel = require('gulp-babel');

gulp.task('build-js', function () {
  return gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist/'))
})

gulp.task('watch', () => {
  gulp.watch('./src/**/*.js', ['build-js'])
})

gulp.task('default', ['build-js', 'watch'])