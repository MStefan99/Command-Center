'use strict';


const {src, dest, watch} = require('gulp');
const pug = require('gulp-pug');


const pugFiles = './src/views/*.pug';


function pugTask() {
	return src(pugFiles)
			.pipe(pug())
			.pipe(dest('./dist/views'));
}


module.exports.default = () => {
	watch(pugFiles, {ignoreInitial: false}, pugTask);
};
