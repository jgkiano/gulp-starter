const gulp          = require('gulp');
const htmlmin       = require('gulp-html-minifier');
const imagemin      = require('gulp-imagemin');
const sass          = require('gulp-sass');
const uncss         = require('gulp-uncss');
const concat        = require('gulp-concat');
const uglifycss     = require('gulp-uglifycss');
const autoprefixer  = require('gulp-autoprefixer');
const uglify        = require('gulp-uglify');

const jsFiles = [
    './src/assets/js/external/jquery.js',
    './src/assets/js/app.js',
];

//welocome message
gulp.task('welcome', () => {
    console.log('gulp gulp gulp...');
});

//combine and minify my js files
gulp.task('scripts', () => {
  return gulp.src(jsFiles)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js'));
});

//combine and minify all my css
gulp.task('combineCss', ['sass','yuckbootstrap'], () => {
    return gulp.src(['./src/assets/css/limbo/*.css'])
    .pipe(concat('style.css'))
    .pipe(uglifycss({
        "maxLineLen": 0,
        "uglyComments": true
    }))
    .pipe(gulp.dest('./dist/assets/css'));
});

//remove bootstrap classes not in use
gulp.task('yuckbootstrap', () => {
    return gulp.src('./src/assets/css/external/bootstrap.css')
    .pipe(uncss({
        html: ['./src/*.html']
    }))
    .pipe(gulp.dest('./src/assets/css/limbo'));
});

//compile my sass and autoprefix it
gulp.task('sass', () => {
    return gulp.src('./src/assets/css/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./src/assets/css/limbo'));
});

//minify my html
gulp.task('minify', () => {
    gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});

//copy the video
gulp.task('copyVid', () => {
    gulp.src('./src/assets/vid/*')
    .pipe(gulp.dest('./dist/assets/vid'))
});

//optimize all the images
gulp.task('finyapicha', () => {
    gulp.src('./src/assets/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/images'))
});

//default tasks
gulp.task('default', [
    'welcome',
    'copyVid',
    'minify',
    'finyapicha',
    'sass',
    'yuckbootstrap',
    'combineCss',
    'scripts'
]);

gulp.task('watch', () => {
    gulp.watch('./src/*.html', ['minify', 'yuckbootstrap', 'combineCss']);
    gulp.watch('./src/products.html', ['minify', 'yuckbootstrap', 'combineCss']);
    gulp.watch('./src/assets/images/*', ['finyapicha']);
    gulp.watch('./src/assets/vid/*', ['copyVid']);
    gulp.watch('./src/assets/css/**/*.scss', ['sass','combineCss']);
    gulp.watch('./src/assets/js/**/*.js', ['scripts']);
});
