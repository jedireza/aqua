'use strict';
const Async = require('async');
const Bcrypt = require('bcrypt');
const Uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes){

    const Session = sequelize.define('Session', {
        id: {
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1,
            type: DataTypes.UUID
        },
        userId: DataTypes.UUID,
        key: { type:DataTypes.STRING, allowNull: false }
    },{
        classMethods : {

            pagedFind: function (where, page, limit, order, include, callback){

                const offset = (page - 1) * limit;
                this.findAndCount(
                    {
                        where,
                        offset,
                        limit,
                        order,
                        include
                    }
            ).then( (result) => {

                const output = {
                    data: undefined,
                    pages: {
                        current: page,
                        prev: 0,
                        hasPrev: false,
                        next: 0,
                        hasNext: false,
                        total: 0
                    },
                    items: {
                        limit,
                        begin: ((page * limit) - limit) + 1,
                        end: page * limit,
                        total: 0
                    }
                };
                output.data = result.rows;
                output.items.total = result.count;

                // paging calculations
                output.pages.total = Math.ceil(output.items.total / limit);
                output.pages.next = output.pages.current + 1;
                output.pages.hasNext = output.pages.next <= output.pages.total;
                output.pages.prev = output.pages.current - 1;
                output.pages.hasPrev = output.pages.prev !== 0;
                if (output.items.begin > output.items.total) {
                    output.items.begin = output.items.total;
                }
                if (output.items.end > output.items.total) {
                    output.items.end = output.items.total;
                }

                callback(null, output);


            }, (err) => {

                return callback(err);
            });
            },
            generateKeyHash: function (callback){

                const key = Uuid.v4();

                Async.auto({
                    salt: function (done) {

                        Bcrypt.genSalt(10, done);
                    },
                    hash: ['salt', function (results, done) {

                        Bcrypt.hash(key, results.salt, done);
                    }]
                }, (err, results) => {

                    if (err) {
                        return callback(err);
                    }

                    callback(null, {
                        key,
                        hash: results.hash
                    });
                });
            },
            createNew: function (userId, callback) {

                const self = this;

                Async.auto({
                    keyHash: function (done){

                        self.generateKeyHash(done);
                    },
                    newSession: ['keyHash', function (results, done) {

                        self.create({
                            userId,
                            key: results.keyHash.hash
                        }).then((session) => {

                            console.log('session is ', session.key);
                            done(null,session);
                        }, (err) => {

                            done(err);
                        });
                    }],
                    clean: ['newSession', function (results, done) {

                        self.destroy({
                            where: {
                                userId,
                                key: { $ne: results.keyHash.hash }
                            }
                        }).then(() => {

                            done(null);
                        }, (err) => {

                            done(err);
                        });
                    }]
                }, (err, results) => {

                    if (err) {
                        return callback(err);
                    }

                    console.log('new session', results.newSession.key);
                    results.newSession.key = results.keyHash.key;
                    console.log('new session', results.newSession.key);

                    callback(null, results.newSession);
                });
            },
            findByCredentials: function (id, key, callback) {

                const self = this;

                Async.auto({
                    session: function (done) {

                        self.findById(id).then((session) => {

                            done(null, session);
                        }, (err) => {

                            done(err);
                        });
                    },
                    keyMatch: ['session', function (results, done) {

                        if (!results.session) {
                            return done(null, false);
                        }

                        const source = results.session.key;
                        Bcrypt.compare(key, source, done);
                    }]
                }, (err, results) => {

                    if (err) {
                        return callback(err);
                    }

                    if (results.keyMatch) {
                        return callback(null, results.session);
                    }

                    callback();
                });
            }
        }
    });

    return Session;
};
