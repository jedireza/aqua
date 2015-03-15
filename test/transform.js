var Babel = require('babel-core');


module.exports = [{
    ext: '.jsx',
    transform: function (content, filename) {

        if (filename.indexOf('node_modules') === -1) {
            var options = {
                sourceMap: 'inline',
                filename: filename,
                sourceFileName: filename
            };
            var result = Babel.transform(content, options);

            return result.code;
        }

        return content;
    }
}];
