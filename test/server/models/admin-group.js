'use strict';
const Async = require('async');
const Code = require('code');
const Lab = require('lab');
const PrepareData = require('../../lab/prepare-data');


const lab = exports.lab = Lab.script();
let sequelize;
let AdminGroup;
let Permission;
let AdminGroupPermissionEntry;
let permissionSpaceMadness;
let permissionUntamedWorld;
let sales;
const permissionNames = ['SPACE_MADNESS', 'UNTAMED_WORLD'];


lab.experiment('AdminGroup Class Methods', () => {

    lab.before((done) => {

        PrepareData( (err, db ) => {

            if ( !err ){
                sequelize = db;
                AdminGroup = sequelize.models.AdminGroup;
                Permission = sequelize.models.Permission;
                AdminGroupPermissionEntry = sequelize.models.AdminGroupPermissionEntry;
            }
            done(err);
        });
    });

    lab.test('it returns a new instance when create succeeds', (done) => {

        AdminGroup.create({ name: 'Sales' }).then( (adminGroup) => {

            sales = adminGroup;
            Code.expect(sales).to.be.an.instanceOf(AdminGroup.Instance);
            done();
        }, ( err ) => {

            done(err);
        });
    });

});


lab.experiment('AdminGroup Instance Methods', () => {

    lab.test('it returns false when permissions are not found', (done) => {

        Async.auto({
            permissionSpaceMadness: function (cb) {

                Permission.create({
                    name: permissionNames[0]
                }).then( ( permission ) => {

                    permissionSpaceMadness = permission;
                    cb(null, permission);
                }, ( err ) => {

                    cb(err);
                });
            },
            permissionUntamedWorld: function (cb) {

                Permission.create({
                    name: permissionNames[1]
                }).then( ( permission ) => {

                    permissionUntamedWorld = permission;
                    cb(null, permission);
                }, ( err ) => {

                    cb(err);
                });
            },
            addPermissions : ['permissionSpaceMadness', 'permissionUntamedWorld', function (results, cb) {

                const permissions = [
                    {
                        admin_group_id: sales.id,
                        permission_id: permissionSpaceMadness.id,
                        active: false
                    },
                    {
                        admin_group_id: sales.id,
                        permission_id: permissionUntamedWorld.id,
                        active: true
                    }
                ];
                Promise.all(
                    [AdminGroupPermissionEntry.upsert(permissions[0]), AdminGroupPermissionEntry.upsert(permissions[1])]
                ).then( (iresults) => {

                    cb(null, iresults);
                }, (err ) => {

                    cb(err);
                });
            }],
            permissionEntries: ['addPermissions', function (results, cb) {

                sales.getAdminGroupPermissionEntries(
                    {
                        include: { model: Permission }
                    }
                ).then( ( iresults ) => {

                    cb(null, iresults);
                }, (err) => {

                    cb(err);
                });
            }]
        }, ( err, results ) => {

            if ( err ) {

                return done(err);
            }

            Code.expect(sales).to.be.an.instanceOf(AdminGroup.Instance);

            const spacePermissionEntry = results.permissionEntries.find( ( elem ) => {

                return elem.Permission.name === permissionNames[0];
            });
            const untamedPermissionEntry = results.permissionEntries.find( (elem ) => {

                return elem.Permission.name === permissionNames[1];
            });

            Code.expect(spacePermissionEntry).to.be.an.instanceOf(AdminGroupPermissionEntry.Instance);
            Code.expect(untamedPermissionEntry).to.be.an.instanceOf(AdminGroupPermissionEntry.Instance);
            Code.expect(spacePermissionEntry.active).to.equal(false);
            Code.expect(untamedPermissionEntry.active).to.equal(true);

            done();
        });
    });
});
