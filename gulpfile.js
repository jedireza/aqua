'use strict';
const RequireDir = require('require-dir');


global.inProduction = process.env.NODE_ENV === 'production';

RequireDir('./gulp');
