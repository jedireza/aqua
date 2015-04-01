var Joi = require('joi');
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var Slug = require('slug');


var AdminGroup = BaseModel.extend({
    constructor: function (attrs) {

        ObjectAssign(this, attrs);
    },
    hasPermissionTo: function (permission) {

        if (this.permissions && this.permissions.hasOwnProperty(permission)) {
            return this.permissions[permission];
        }

        return false;
    }
});


AdminGroup._collection = 'adminGroups';


AdminGroup._idClass = String;


AdminGroup.schema = Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string().required(),
    permissions: Joi.object().description('{ permission: boolean, ... }')
});


AdminGroup.create = function (name, callback) {

    var document = {
        _id: Slug(name).toLowerCase(),
        name: name
    };

    this.insertOne(document, function (err, docs) {

        if (err) {
            return callback(err);
        }

        callback(null, docs[0]);
    });
};


module.exports = AdminGroup;
