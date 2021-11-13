'use strict';


const {src, dest, watch, parallel} = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');


const pugFiles = './static/views/**/*.pug';
const stylusFiles = './static/style/**/*.styl';
const imageFiles = './static/img/**/*';


function compilePug() {
	return src(pugFiles)
			.pipe(pug())
			.pipe(dest('./dist/'));
}


function compileStylus() {
	return src(stylusFiles)
			.pipe(stylus())
			.pipe(dest('./dist/style/'));
}


function copyImages() {
	return src(imageFiles)
			.pipe(dest('./dist/img/'));
}


if (process.argv.some(a => a === '-w')) {
	module.exports.default = () => {
		watch(pugFiles, {ignoreInitial: false}, compilePug);
		watch(stylusFiles, {ignoreInitial: false}, compileStylus);
		watch(imageFiles, {ignoreInitial: false}, copyImages);
	};
} else {
	module.exports.default = parallel(compilePug, compileStylus, copyImages);
}
