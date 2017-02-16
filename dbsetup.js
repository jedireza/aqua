'use strict';
const Sequelize = require('sequelize');
const Config = require('./config');

const db = Config.get('/db');

exports.register = function (server, options, next){

    server.register([
        {
            register: require('hapi-sequelize'),
            options: [
                {
                    name: 'aqua',
                    models: ['./server/models/**/*.js'],
                    sequelize: new Sequelize(db.database, db.username, process.env.DB_PASSWORD, {
                        host: 'localhost',
                        dialect: 'postgres',
                        pool: {
                            max: 5,
                            min: 0,
                            idle: 10000
                        }
                    }), // sequelize instance
                    sync: true, // sync models - default false
                    forceSync: false//, // force sync (drops tables) - default false
                }
            ]
        }
    ], next);
};

exports.register.attributes = {
    name: 'dbconfig'
};
