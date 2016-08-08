var Jsdom = require('jsdom');

global.document = Jsdom.jsdom('<html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
// global.document.body.classList = {
//     add: function () {},
//     remove: function () {}
// };
