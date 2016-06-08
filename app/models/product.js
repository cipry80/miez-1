'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Mixed = Schema.Types.Mixed;

const Money = require('./money').schema;

const commonHelper = require('../helpers/common');

const ProductSchema = new Schema({
	sku: { type: String, required: true },
	category: { type: String },
	title: { type: String, required: true },
	slug: { type: String },
	images: { type: [
		{
			caption: { type: String },
			filename: { type: String }
		}
	] },
	details: { 
		title:        { type: String },
	  description:  { type: String },
	  summary:      { type: String, required: true }
	},
	price: { type: Money },
	active: { type: Boolean, default: false }
});

ProductSchema.pre('save', function(next) {
  this.slug = commonHelper.createSlug(this.title);
  next();
});

ProductSchema.statics.findBySKU = function findBySKU(sku, callback) {
  this.findOne({ sku: sku }, callback);
}

ProductSchema.statics.findBySlug = function findBySlug(sku, callback) {
  this.findOne({ slug: slug }, callback);
}

module.exports = mongoose.model('Product', ProductSchema);