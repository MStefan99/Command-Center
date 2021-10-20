'use strict';

const path = require('path');

const {VueLoaderPlugin} = require('vue-loader');


module.exports = {
	mode: 'development',
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{test: /.vue$/, use: 'vue-loader'},
			{test: /.pug$/, use: 'pug-loader'},
			{test: /.styl(us)?$/, use: ['style-loader', 'css-loader', 'stylus-loader']},
			{test: /.css$/, use: ['style-loader', 'css-loader']}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	],
	devServer: {
		static: './dist',
		port: 3000,
		hot: true
	},
	stats: 'minimal'
};
