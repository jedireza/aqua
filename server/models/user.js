'use strict';
const Bcrypt = require('bcrypt');
const Async = require('async');

module.exports = function (sequelize, DataTypes){

    const _hashPassword = function (user, options, cb){

        Bcrypt.genSalt(10, (err, salt) => {

            if (err){
                return cb(err);
            }
            Bcrypt.hash(user.password, salt, (err, hash) => {

                if (err){
                    return cb(err);
                }
                // Store hash in your password DB.
                user.setDataValue('password_hash', hash);
                cb(null, user);
            });
        });
    };

    const User = sequelize.define('User', {
        id: {
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1,
            type: DataTypes.UUID
        },
        isActive: DataTypes.BOOLEAN,
        username: { type:DataTypes.STRING, allowNull: false, validate: { isLowercase: true, min: 4 } },
        password_hash: { type:DataTypes.STRING },//, allowNull: false, validate: { min: 20} ,
        password: {
            type: DataTypes.VIRTUAL
        },
        email: { type:DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
        reset_token: { type:DataTypes.STRING },
        reset_expires: { type:DataTypes.DATE }
    },{
        hooks: {
            beforeCreate: _hashPassword,
            beforeUpdate: _hashPassword
        },
        instanceMethods : {
            toJSON: function (){

                const values = Object.assign({}, this.get());
                delete values.password_hash;
                delete values.password;
                delete values.reset_token;
                delete values.reset_expires;
                return values;
            },
            comparePassword: function (password, cb){

                Bcrypt.compare(password, this.password_hash, cb);
            },
            canPlayRole: function (role) {
                //must run hydrate first for this to work
                //should this check that?
                if (!this.roles) {
                    return false;
                }

                return this.roles.hasOwnProperty(role);
            },
            hydrateRoles: function (callback) {

                const Admin = sequelize.models.Admin;
                const Account = sequelize.models.Account;

                const self = this;
                const roles = {};
                const findAdmin = Admin.findOne({
                    where: {
                        user_id : self.id
                    }
                });
                const findAccount = Account.findOne({
                    where: {
                        user_id : self.id
                    }
                });
                Promise.all([findAdmin, findAccount]).then((results) => {

                    if ( results[0]){
                        roles.admin = results[0];
                    }
                    if ( results[1]){
                        roles.account = results[1];
                    }
                    self._roles = roles;
                    self.roles = roles;
                    callback(null, self._roles);
                }, (err) => {

                    callback(err);
                });
            }
        },
        classMethods : {
            generatePasswordHash: function (user, options, cb){

                _hashPassword(user, options, cb);
            },
            associate: function (db){

                User.hasOne(db.Account, { foreignKey: 'user_id' });
                User.hasOne(db.Admin, { foreignKey: 'user_id' });
                User.hasMany(db.NoteEntry, { foreignKey: 'user_id' });
                User.hasMany(db.StatusEntry, { foreignKey: 'user_id' });
            },
            findByCredentials: function (username, password, callback){

                const self = this;
                Async.auto({
                    user: function (done) {

                        const query = {
                            isActive: true
                        };

                        if (username.indexOf('@') > -1) {
                            query.email = username.toLowerCase();
                        }
                        else {
                            query.username = username.toLowerCase();
                        }

                        self.findOne({
                            where: query
                        }).then((user) => {

                            done(null,user);
                        }, (err) => {

                            done(err);
                        });
                    },
                    passwordMatch: ['user', function (results, done) {

                        if (!results.user) {
                            return done(null, false);
                        }

                        const source = results.user.password_hash;
                        Bcrypt.compare(password, source, done);
                    }]
                }, (err, results) => {

                    if (err) {
                        return callback(err);
                    }

                    if (results.passwordMatch) {
                        return callback(null, results.user);
                    }

                    callback();
                });
            },
            pagedFind: function (where, page, limit, order, isAdmin, isAccount, callback){

                const offset = (page - 1) * limit;
                const include = [];
                if ( isAdmin ){
                    include.push({
                        model : sequelize.models.Admin,
                        where : { user_id: { $ne: null } }
                    });
                }
                if ( isAccount ){
                    include.push({
                        model : sequelize.models.Account,
                        where : { user_id: { $ne: null } }
                    });
                }

                this.findAndCount(
                    {
                        where,
                        offset,
                        limit,
                        order,
                        include
                    }
        ).then((result) => {

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

            }
        },
        version:true
    });

    return User;
};
