
var mongoose 	= require( 'mongoose' ),
    Schema 		= mongoose.Schema;

var Post = new Schema({
    _id         : Schema.ObjectId,
    userID      : Number,
    userName    : String,
    data        : String,
    image       : String,
    createdOn   : Date
});

mongoose.model( 'Post', Post );