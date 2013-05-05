
var mongoose    = require( 'mongoose' ),
    GroupUser   = mongoose.model( 'GroupUser' ),
    Group       = mongoose.model( 'Group'),
    utils       = require( '../utils/utils' );


module.exports.joinGroup = function ( req, res ){
    var params = req.body;

    res.json(createUserGroupConnection( params.user, params.group, false));

}

module.exports.createUserGroupConnection = function( user, group, isAdmin ){
    var params = {},
        result = {};

    params.createdOn    = new Date();
    params.user         = user;
    params.group        = group;
    params.isAdmin      = isAdmin;

    var groupUser = new GroupUser( params );

    groupUser.save( function( err, group, count ){
        if( err ){
            result.result   = false;
            result.data     = err;
            result.msg      = "noUserGroupConnection";
        } else {
            result.result   = true;
            result.data     = { groupID: group };
            result.msg      = "connectionSuccess";

        }

        return result;
    });
}

module.exports.removeUserFromGroup = function( user, group ){
    var result = {};

    GroupUser.remove( { group: group, user: user }, function( err ){
        if( err ){
            return utils.createResult( false, err, "dbError" );
        }

        var groupIsEmpty = removeGroupIfIsEmpty( group );

        if( !groupIsEmpty.result && groupIsEmpty.msg == 'dbError' ){
            result = utils.createResult( false, err, "dbError" );

        } else if( !groupIsEmpty.result ){
            var isAdminRes = isAdmin( user, group );
            
            if( isAdminRes.result ){
                result = changeAdmin( group );

            } else if( isAdminRes.msg == "dbError" ) {
                result = utils.createResult( true, null, "dbError" );

            } else {
                result = utils.createResult( true, null, "userRemoved" );
            }

        } else {
            result = utils.createResult( true, null, "userAndGroupRemoved" );
        }

        return result;
    });
}

function changeAdmin( group ){
    GroupUser.findOne( { group: group } ).sort( { createdOn: 1 } ).exec( function( err, groupUser ){
        if ( err ) {
            return utils.createResult( false, err, "dbError" );

        } else {
            return utils.createResult( true, { admin: groupUser }, "adminChanged" );
        }
    });
}

function isAdmin( user, group ){
    var result = {};

    GroupUser.findOne( { user: user, group: group }, function( err, groupUser ){
        if( err ){
            return utils.createResult( false, err, "dbError" );

        } else if( groupUser.lngth > 0 && groupUser.isAdmin ){
            result = utils.createResult( true, null, "isAdmin" );

        } else {
            result = utils.createResult( false, null, "notAdmin" );
        }

        return result;
    });

}

function removeGroupIfIsEmpty( group ){
    var result = {};

    GroupUser.findOne( { group: group }, function( err, groupUser ){
        if ( err ) {
            return utils.createResult( false, err, "dbError" );
        }

        if( !groupUser ){
            Group.remove({ group: group }, function( err ){
                if( err ){
                    result = utils.createResult( false, err, "dbError" );

                } else {
                    result = utils.createResult( true, null, "groupRemoved" );

                }

                return result;
            });

        } else {
            return utils.createResult( false, null, "groupNotEmpty" );
        }
    });
}
