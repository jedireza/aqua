'use strict';
const Babel = require('babel-core');


const transformer = function (content, filename) {

    if (/^node_modules/.test(filename)) {
        return content;
    }

    if (/^server/.test(filename) &&
        /^server\/web/.test(filename) === false) {

        return content;
    }

    if (/^test/.test(filename) &&
        /^test\/client/.test(filename) === false) {

        return content;
    }

    if (/^config\.js|manifest\.js/.test(filename)) {
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
