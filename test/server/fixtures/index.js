'use strict';
const Creds = require('./creds');
const Db = require('./db');
const Hapi = require('./hapi');


class Fixtures {}


Fixtures.Creds = Creds;
Fixtures.Db = Db;
Fixtures.Hapi = Hapi;


module.exports = Fixtures;
