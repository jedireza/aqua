'use strict';
const Jsdom = require('jsdom');


global.document = new Jsdom.JSDOM('<html><body></body></html>');
global.window = global.document.window;
global.document = global.window.document;
global.navigator = global.window.navigator;
