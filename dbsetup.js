'use strict';
const Sequelize = require('sequelize');
const Config = require('./config');

const db = Config.get('/db');

exports.register = function (server, options, next){

    let sequelize;
    if ( process.env.DATABASE_URL) {
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });
    }
    else {
        sequelize = new Sequelize(db.database, db.username, process.env.DB_PASSWORD, {
            host: db.host,
            dialect: 'postgres',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        });
    }

    server.register([
        {
            register: require('hapi-sequelize'),
            options: [
                {
                    name: 'aqua',
                    models: ['./server/models/**/*.js'],
                    sequelize, // sequelize instance
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
