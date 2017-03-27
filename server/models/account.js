'use strict';

module.exports = function (sequelize, DataTypes){

    const Account = sequelize.define('Account', {
        id: {
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1,
            type: DataTypes.UUID
        },
        first: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { min: 1 }
        },
        middle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        instanceMethods: {
            toJSON: function (){

                const values = Object.assign({}, this.get());
                return values;
            }
        },
        classMethods: {
            parseName: function (fullName){

                const nameParts = fullName.trim().split(/\s/);
                const name = {
                    first: nameParts.shift(),
                    middle: nameParts.length > 1 ? nameParts.shift() : '',
                    last: nameParts.join(' ')
                };
                return name;

            },
            associate: function (db){

                Account.belongsTo(db.User, { foreignKey: 'user_id' });
                Account.hasMany(db.NoteEntry, { foreignKey: 'account_id' });
                Account.hasMany(db.StatusEntry, { foreignKey: 'account_id' });
            },
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

                        //result.rows.toJSON = function () {

                        //    JSON.stringify(result.rows);
                        //};
                        console.log('rows is ',  Array.isArray(result.rows));

                        callback(null, output);


                    }, (err) => {

                        return callback(err);
                    });
            }
        },
        version: true
    });

    return Account;
};
