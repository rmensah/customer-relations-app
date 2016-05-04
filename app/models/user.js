// Grabing packages needed for the user mode

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


//user schema

var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true,

		index: { uniqu: true }},

		password: { type:  String, required: true,


			select: false}

});