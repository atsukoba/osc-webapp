let gulp = require('gulp');
let sass = require('gulp-sass');
let server = require('gulp-express');


gulp.task('scss', () => {
  gulp.src('./public/stylesheets/scss/style.scss').pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('sass-watch', gulp.task('scss'), () => {
  let watcher = gulp.watch('./public/stylesheets/scss/*.scss', ['scss']);
  watcher.on('change', function (event) {
  });
});

gulp.task('express', () => {
  server.run(['./app.js']);
})

gulp.task('default', gulp.parallel('sass-watch', 'express'));
