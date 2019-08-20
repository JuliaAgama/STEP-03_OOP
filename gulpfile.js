;

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

const webpackStream = require('webpack-stream');

const gulpIf = require('gulp-if'); // to choose options of doing\not-doing some pipes;
// e.g. not minify\uglify in PRODUCTION mode (if isProd = true)

// let isDev = false; //choose PRODUCTION  mode for WEBPACK
let isDev = true; //choose DEVELOPMENT mode for WEBPACK
let isProd = !isDev;


/*********** ERRORS NOTIFYING function **********/

const onError = function (err) {
    console.log('...OOOOOOPSSSS...');
    notify.onError({
        title: 'NOTIFY message for DUDE: Error in plugin: '+ err.plugin + '. CHECK IT!!\n',
        message: err.message
    })(err);
    this.emit('end');
}


/*********** Dist Directory Clean **********/

gulp.task('clean', function () {
    return gulp.src('dist/**/*.*', {read: false})
        .pipe(clean());
});


/*********** STYLES PROCESSING **********/

gulp.task('styles', function () {
    return gulp.src('src/scss/style.scss')
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefixer({
        overrideBrowserslist: ['> 0.1%'],
        cascade: false
    }))
    .pipe(gulpIf(isProd, cleanCss({ //minifies only in PRODUCTION mode
        level: 2
    })))
    .pipe(rename({
        suffix: '.min'
    }))
    // .pipe(gulpIf(isProd, rename({ //renames only in PRODUCTION mode
        // suffix: '.min'
    // })))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.reload({stream: true}))
});


/*********** SCRIPTS PROCESSING **********/

gulp.task('scripts-src', function () { //gathers all .js files to one;
    return gulp.src('src/js/partials/**/*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('script.js'))
        .pipe(gulp.dest('src/js/'))
        .pipe(browserSync.reload({stream: true}))
});

let webpackConfig = {
    output: {
        filename: 'script.min.js'
        // filename: isDev ? 'script.js' : 'script.min.js' //create full file name in DEVELOPMENT mode and min.file name in BUILD MODE
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },
      mode: isDev ? 'development' : 'production',
      devtool: isDev ? 'eval-sourcemap' : 'source-map' // creates sourcemaps:y for DEVELOPMENT mode - included, for PRODUCTION mode - separately, https://webpack.js.org/configuration/devtool/
};

gulp.task('scripts', function () { //sends script.js to dist (different options for DEVELOPMENT or PRODUCTION modes);
    return gulp.src('src/js/script.js')
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.reload({stream: true}))
});


/*********** MINIFY IMAGES **********/

gulp.task('image-min', function () {
    return gulp.src('src/img/**/*.+(jpg|png|jpeg|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'))
        .pipe(browserSync.reload({stream: true}))
});


/*********** BROWSER SYNC **********/

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
        // tunnel: true
    });
});

/*********** WATCHERS **********/

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', gulp.parallel('styles'));
    gulp.watch('src/js/partials/*.js', gulp.series('scripts-src', 'scripts'));
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('src/img/**/*.+(jpg|png|jpeg|svg)', gulp.parallel('image-min'));
});




/*********** MAIN TASKS **********/

gulp.task('build', gulp.series('clean', 'scripts-src',
                    gulp.parallel('styles', 'scripts', 'image-min')));

gulp.task('dev', gulp.parallel('browser-sync', 'watch'));

gulp.task('default', gulp.series('build', 'dev'));
