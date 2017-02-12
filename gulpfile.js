var gulp = require('gulp'), // Сообственно Gulp JS
    coffee = require('gulp-coffee');
    prefix = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-sass'), 
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    postcss = require('gulp-postcss'),
    nested = require('postcss-nested'),
    livereload = require('gulp-livereload'),
    pug = require('gulp-pug'),
    del = require('del'),

    paths = {
        scripts: [
            'src/js/slick.js',
            'src/js/jquery.validate.min.js',
            'src/js/animsition.js',
            'src/js/theme.js'
            ],
        styles: 'src/scss/**/*.scss',
        svg: 'src/img/*.svg'
    },

    processors = [
      prefix({
          browsers: ['last 4 version']
      }),
      nested//працює через postcss
    ];

gulp.task('html', function() {
  return gulp
    .src('src/*.html')
    .pire(postcss(processors))
    .pipe(gulp.dest('html/'))
});

gulp.task('pug', function buildHTML() {
  return gulp.src('src/pug/*.pug')
  .pipe(pug({pretty: true}))
  .pipe(gulp.dest('html/'))
  .pipe(livereload())
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify().on('error', notify.onError(function (error) {
            return "Scripts error:" + error.message;
        }))
    )
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('js'))
    .pipe(livereload())
});

gulp.task('styles', function() {
  return gulp.src('src/scss/style.scss')
    .pipe(sass({
        outputStyle: 'compressed',
    }).on('error', notify.onError(function (error) {
            return "Style error:" + error;
        }))
    )
    .pipe(prefix({
              browsers: ['last 2 versions'],
              cascade: false
          }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('css'))
    .pipe(livereload())
});

gulp.task('scss', function() {
  return gulp.src('src/new-scss/*.scss')
    .pipe(sass({
        outputStyle: 'expanded',
    }).on('error', notify.onError(function (error) {
            return "Style error:" + error;
        }))
    )
    .pipe(prefix({
              browsers: ['last 2 versions'],
              cascade: false
            }))
    .pipe(gulp.dest('css/'));
});

gulp.task('svgSprite', function () {
    return gulp.src(paths.svg)
    .pipe(svgmin().on('error', notify.onError(function (error) {
            return "SVG min error:" + error.message;
        }))
    )
    .pipe(svgSprite({
      "mode": {
        "css": {
          "spacing": { "padding": 5 },
          "dest": "./",
          "layout": "diagonal",
          "sprite": "img/sprite.svg",
          "bust": false,
          "render": {
            "scss": {
              "dest": "src/scss/vendor/_sprite.scss",
              "template": "src/scss/sprite-template.scss"
            }
          }
        }
      }
    }).on('error', notify.onError(function (error) {
            return "SVG error:" + error.message;
        }))
    )
    .pipe(gulp.dest('.'))
    .pipe(livereload())
});


gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.svg, ['svgSprite']);
  gulp.watch(paths.styles, ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'svgSprite', 'styles']);