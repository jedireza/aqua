'use strict';
const Jsdom = require('jsdom');
const Exenv = require('exenv');


global.document = new Jsdom.JSDOM('<html><body></body></html>');
global.window = global.document.window;
global.document = global.window.document;
global.navigator = global.window.navigator;

// for `react-side-effect` via `react-helment` for when we test client and
// server in the same run
Exenv.canUseDOM = false;
