'use strict';

module.exports = function (sequelize, DataTypes){

    const NoteEntry = sequelize.define('NoteEntry', {
        id: {
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1,
            type: DataTypes.UUID
        },
        data: { type:DataTypes.STRING, allowNull: false, defaultValue: '' }

    }, {
        instanceMethods: {
            toJSON: function (){

                const values = Object.assign({}, this.get());
                return values;
            }
        },
        classMethods: {
            associate: function (db){

                NoteEntry.belongsTo(db.Account, { foreignKey: 'account_id' });
                NoteEntry.belongsTo(db.User, { foreignKey: 'user_id' });
            }
        }
    });

    return NoteEntry;
};
