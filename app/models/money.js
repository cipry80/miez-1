'use strict';

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_SCALE_FACTOR = 100;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const MoneySchema = new Schema({
	amount: { type: Number, default: 0 },
	currency: { type: String, default: DEFAULT_CURRENCY },
	factor: { type: Number, default: DEFAULT_SCALE_FACTOR }
}, {
	_id: false,
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

MoneySchema
.virtual('value')
.set(function(value) {
	if (value) {
		this.set('amount', value * this.factor);
	}
})
.get(function() {
	return this.amount / this.factor;
});

module.exports = mongoose.model('Money', MoneySchema);