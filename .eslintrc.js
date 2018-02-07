'use strict';

module.exports = {
    extends: [
        'eslint-config-hapi',
        'plugin:react/recommended'
    ],
    parserOptions: {
        ecmaVersion: 8,
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    }
};
