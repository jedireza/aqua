'use strict';

module.exports = function (sequelize, DataTypes){

    const Admin = sequelize.define('Admin', {
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
            isMemberOf: function (models, group, callback){

                const self = this;
                const AdminGroup = models.AdminGroup;
                //const Admin = models.Admin;
                AdminGroup.findOne(
                    {
                        where:{
                            name : group
                        },
                        include : [{
                            model : Admin,
                            where : { id: self.id }
                        }]
                    }
        ).then((adminGroup) => {

            if ( adminGroup ){
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        }, (err) => {

            callback(err);
        });
            }

        },
        classMethods: {
            associate: function (db){

                Admin.belongsTo(db.User, { foreignKey: 'user_id', allowNull: true });
                Admin.belongsToMany(db.AdminGroup, { through: 'AdminAdminGroups' });
                Admin.hasMany(db.AdminPermissionEntry, { foreignKey : 'admin_id' });
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

            callback(null, output);


        }, (err) => {

            return callback(err);
        });
            }
        },
        version: true
    });

    return Admin;
};
