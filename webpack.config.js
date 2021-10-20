'use strict';

const path = require('path');

const {VueLoaderPlugin} = require('vue-loader');


module.exports = {
	mode: 'development',
	entry: {
		index: './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{test: /.vue$/, use: 'vue-loader'},
			{
				test: /\.pug$/,
				oneOf: [
					{resourceQuery: /^\?vue/, use: ['pug-plain-loader']},
					{use: ['raw-loader', 'pug-plain-loader']}
				]
			},
			{test: /.styl(us)?$/, use: ['style-loader', 'css-loader', 'stylus-loader']}
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
