const gulp = require('gulp');
const server = require('gulp-express');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');


gulp.task('scss', () => {
  gulp.src('./public/stylesheets/scss/style.scss')
    .pipe(
      sass({
        outputStyle: 'expanded'
      }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/stylesheets/css'));
});

gulp.task('sass-watch', gulp.task('scss'), () => {
  let watcher = gulp.watch('./public/stylesheets/scss/*.scss', ['scss']);
  watcher.on('change', function () {
    console.log("sass file changed");
  });
});

gulp.task('express', () => {
  server.run(['./app.js']);
})

gulp.task('lint', () => {
  return gulp.src(['**/*.js','!node_modules/**'])
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', gulp.parallel('sass-watch', 'express'));
