'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var ContactSchema = new Schema({
	email:  {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
	city: {
		type: String
	},
	phone: {
		type: String
	},
	company: {
		type: String
	},
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: { 
  	type: ObjectId, 
  	ref: 'User'
  }
});

module.exports = mongoose.model('Contact', ContactSchema);