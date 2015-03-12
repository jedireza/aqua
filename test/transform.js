var Babel = require('babel-core');

module.exports = [
	{ ext: '.jsx', transform: function (content, filename) {

		if (filename.indexOf('node_modules') === -1) {
			var result = Babel.transform(content, { sourceMap: 'inline', filename: filename, sourceFileName: filename });
			return result.code;
		}

		return content;
	}}
];
