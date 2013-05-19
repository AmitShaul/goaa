
var mongoose        = require( 'mongoose' ),
    utils           = require( '../utils/utils' ),
    _               = require( 'underscore' ),
    config          = require( '../settings/config' ),
    GroupUsers      = require( './groups-users' ),
    GroupUsersModel = mongoose.model( 'GroupUser' ),
    Group           = mongoose.model( 'Grouptemp' ),
    settings        = config.settings;

module.exports.joinGroup = function( req, res ){
    var params = req.body;

    GroupUsers.createUserGroupConnection( params.user, params.group, false, function( result ){
        res.json( result );
    });
}

module.exports.getGroupsByUser = function( req, res ){

    var userID          = req.body.userID,
        groupIDsArray   = [],
        result;

    GroupUsersModel.find( { user: userID }, { group: 1, _id: 0 }, function( err, groupIDs ){
        if( err )
            res.json( utils.createResult( false, err, "dbError" ) );

        else {
            _.each( groupIDs, function( groupObj ){
                groupIDsArray.push( groupObj.group );
            });

            Group.find( { _id: { $in: groupIDsArray } }, function( err, groups ){
                if( err ){
                    result = utils.createResult( false, err, "dbError" );
                    return false;

                } else
                    result = utils.createResult( true, groups, "fetchGroupsByUser" );

                res.json( result );
            });
        }
    });
}

module.exports.searchGroup = function ( req, res ){
    var groupName   = req.body.groupName,
        pattern     = "^" + groupName,
        exp         = new RegExp( pattern, "i" ),
        result      = {};

    if( groupName == undefined || groupName == "" ){
        res.json( utils.createResult( false, [], "emptyQuery" ) );

    } else {
        Group.find( { name: exp }, function( err, docs ) {
            if ( err ){
                result = utils.createResult( false, err, "dbError" );

            } else if( !docs || docs.length == 0 ) {
                result = utils.createResult( false, [], "noResults" );

            } else {
                result = utils.createResult( true, docs, "foundGroups" );

            }

            res.json( result );
        });
    }

}

module.exports.editGroup = function( req, res ) {
    var params      = req.body,
        result      = {},
        groupID     = params.groupID;

    Group.update(
        { _id: groupID },

        { $set: {
            "address.country"   : params.country,
            "address.city"      : params.city,
            "address.street"    : params.street,
            "address.house"     : params.house,
            "address.apartment" : params.apartment
        } },

        { upsert: true },

        function( err ){
            if ( err ) {
                result.result   = false;
                result.data     = err;
                result.msg      = "errorInUpdate";

            } else {
                result.result   = true;
                result.data     = null;
                result.msg      = "addressUpdated";
            }
        }
    );
}

module.exports.makeGroup = function( req, res ) {
    var params = req.body;

    params.createdOn = new Date();
    if( params.image == undefined || params.image == "" ){
        params.image = settings.defaultAvatar;
    }

    validateGroupRequest( params, function( result ){
        if( result.result ){

            var group = new Group( params );
            group.save( function( err, group, count ){
                if( err ){
                    res.json( utils.createResult( false, err, "groupNotSavedToDB" ) );

                } else {
                    GroupUsers.createUserGroupConnection( req.user._id, group._id, true, function( result ){
                        res.json( result );
                    });

                }
            });

        } else {
            res.json( result );
        }
    });
}

function validateGroupRequest ( params, callback ){

    var result = utils.isAllFieldsAreNotNullOrEmpty( params );

    if( result.result ) {
        isGroupExist( params.name, function( exist, group ){
            if( exist ){
                result.result   = false;
                result.data     = group;
                result.msg      = "groupExist";
            }

            callback( result );
        });

    } else {
        callback( result );
    }


}

function isGroupExist( name, callback ) {
    Group.findOne({ name: name }, function( err, group ){
        callback( group != null, group );
    });
}

