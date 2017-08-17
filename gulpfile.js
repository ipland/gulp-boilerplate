var gulp         = require('gulp')
var imagemin     = require('gulp-imagemin')
var cleanCSS     = require('gulp-clean-css')
var rename       = require('gulp-rename')
var concat       = require('gulp-concat')
var browserSync  = require('browser-sync').create()
var postcss      = require('gulp-postcss')
var sourcemaps   = require('gulp-sourcemaps')
var assets       = require('postcss-assets')
var htmlreplace  = require('gulp-html-replace')

var config = {
   srcCss     : 'src/css/*.css',
   buildCss   : 'dist/css',
   srcImage   : 'src/image/*',
   buildImage : 'dist/image',
   srcHTML    : 'index.html',
   /**
    * srcHTMLMap
    * index
    * css
    * js
    * @type {String}
    */
   buildHTML  : 'dist/'
}

gulp.task('html-replace', function () {
  gulp.src(config.srcHTML)
    .pipe(htmlreplace({
      'css': 'css/base.min.css',
    }))
    // .pipe(minifyHTML(opts))
    .pipe(gulp.dest(config.buildHTML));
})

// ------------------------------------
// postcss complier
// ------------------------------------
gulp.task('css', function () {
  gulp.src(config.srcCss)

    .pipe( sourcemaps.init() )
    .pipe( postcss([
      require('precss'),
      require('autoprefixer'),
      assets({
        relative: true,
        loadPaths: [config.srcImage]
      })
    ]))
    .pipe( gulp.dest(config.buildCss) )
    .pipe( cleanCSS() )
    .pipe( rename({ extname: '.min.css' }) )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest(config.buildCss) )
    .pipe( browserSync.stream() );
})

// ------------------------------------
// image complier
// ------------------------------------
gulp.task('image', () =>
   gulp.src(config.srcImage)

     .pipe(imagemin())
     .pipe(gulp.dest(config.buildImage))
)

// ------------------------------------
// process JS files and return the stream.
// ------------------------------------
gulp.task('default', ['build-css', 'watch'])

gulp.task('serve', ['css', 'image', 'html-replace'], function() {
   browserSync.init({
      server: {
         baseDir: './'
      }
   });
   gulp.watch(config.srcCss, ['css'])
   gulp.watch(config.srcImage, ['image'])
   gulp.watch("*.html").on('change', browserSync.reload)
})
gulp.task('default', ['serve'])

// ------------------------------------
// build CSS
// ------------------------------------
gulp.task('build-css', function(cb) {
   gulp.src(config.srcCss)

      // output non-minified CSS file
      .pipe( sourcemaps.init() )
      .pipe( postcss([ require('precss'), require('autoprefixer') ]) )
      .pipe( gulp.dest(config.buildCss) )

      // output all css in single file
      // .pipe( concat('all.css') )
      // .pipe( gulp.dest(config.buildCss) )

      // output the minified version
      .pipe( cleanCSS() )
      .pipe( rename({ extname: '.min.css' }) )
      .pipe( sourcemaps.write('.') )
      .pipe( gulp.dest(config.buildCss) )
   cb()
})

// ------------------------------------
// build CSS & image
// ------------------------------------
gulp.task('build', ['build-css', 'image'])
