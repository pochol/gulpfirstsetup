var gulp = require('gulp');
// adding gulp-sass plugin
var sass = require('gulp-sass');
// browser synk
var browserSync = require('browser-sync').create();
// useref
var useref = require('gulp-useref');
// minifizinng files 
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
// minifiy css files
var cssnano = require('gulp-cssnano');
// images optymize
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

var del = require('del');

var runSequence = require('run-sequence');


// gulp task sass
gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.reload({
			stream : true
		}))
});

// gulp task useref
gulp.task('images', function(){
	console.log('start');
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
});
// gulp task useref
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});


gulp.task('useref', function(){
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

// browserSynk
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir : 'app'
		},
		browser: "google chrome"
	})
});

gulp.task('clear:dist', function() {
  return del.sync('dist');
})

gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})
// watch task
// add browserSynk before sass task
gulp.task('watch', ['browserSync', 'sass'], function(){
	// gulp watch 
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

// gulp build
gulp.task('build', function(callback){
		runSequence('clear:dist', 'cache:clear',
			['sass', 'useref', 'images', 'fonts'],
			callback
		)
});
gulp.task('default', function(callback){
		runSequence(
			['sass', 'browserSync', 'watch'],
			callback
		)
});







