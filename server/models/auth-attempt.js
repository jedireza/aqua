'use strict';
const Async = require('async');
const Config = require('../../config');

module.exports = function (sequelize, DataTypes){

    const AuthAttempt = sequelize.define('AuthAttempt', {
        id: {
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1,
            type: DataTypes.UUID
        },
        username: { type:DataTypes.STRING, allowNull: false, validate: { min: 1 } },
        ip: { type:DataTypes.STRING, allowNull: false, validate: { min: 1 } }
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
            abuseDetected: function (ip, username, callback){

                const self = this;

                Async.auto({
                    abusiveIpCount: function (done) {

                        self.count({
                            where: {
                                ip
                            }
                        }).then((count) => {

                            done(null, count);
                        }, (err) => {

                            done(err);
                        });
                    },
                    abusiveIpUserCount: function (done) {

                        self.count({
                            where: {
                                ip,
                                username: username.toLowerCase()
                            }
                        }).then((count) => {

                            done(null, count);
                        }, (err) => {

                            done(err);
                        });
                    }
                }, (err, results) => {

                    if (err) {
                        return callback(err);
                    }

                    const authAttemptsConfig = Config.get('/authAttempts');
                    const ipLimitReached = results.abusiveIpCount >= authAttemptsConfig.forIp;
                    const ipUserLimitReached = results.abusiveIpUserCount >= authAttemptsConfig.forIpAndUser;

                    callback(null, ipLimitReached || ipUserLimitReached);
                });

            }
        }
    });

    return AuthAttempt;
};
