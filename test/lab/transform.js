'use strict';
const Babel = require('babel-core');


const transformer = function (content, filename) {

    if (/^node_modules/.test(filename)) {
        return content;
    }
    if (/^server\/models/.test(filename)) {
        return content;
    }

    const transformed = Babel.transform(content, {
        filename,
        sourceMap: 'inline',
        sourceFileName: filename,
        auxiliaryCommentBefore: '$lab:coverage:off$',
        auxiliaryCommentAfter: '$lab:coverage:on$'
    });

    return transformed.code;
};

const extensions = ['js', 'jsx'];
const labTransforms = [];

extensions.forEach((extension) => {

    labTransforms.push({
        ext: extension,
        transform: transformer
    });
});


module.exports = labTransforms;
