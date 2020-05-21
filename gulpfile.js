"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
var del = require("del");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("css-no-map", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("css-min", function () {
  return gulp.src("source/css/*.css")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("css-min-no-map", function () {
  return gulp.src("source/css/*.css")
    .pipe(plumber())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest("build/css"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch("source/sass/**/*.{scss,sass,css}", gulp.series("css"));
  gulp.watch("source/css/*.css", gulp.series("css-min"));
  gulp.watch("source/img/sprite-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done){
  server.reload();
  done();
});

gulp.task("sprite", function () {
  return gulp.src("source/img/sprite-*.svg")
  .pipe(imagemin([ imagemin.svgo() ]))
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("source/img"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.mozjpeg({progressive:true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality:90}))
    .pipe(gulp.dest("source/img"));
});

gulp.task('js', function () {
  return gulp.src("source/js/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([ include() ]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "!source/img/sprite*.svg",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("build", gulp.series("clean", "copy", "css", "css-min", "sprite", "html"));
gulp.task("build-no-map", gulp.series("clean", "copy", "css-no-map", "css-min-no-map", "sprite", "html"));
gulp.task("start", gulp.series("build", "server"));
