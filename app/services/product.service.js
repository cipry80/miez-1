'use strict';

const mongoose = require('mongoose');
const Product = require('../models/product');

class ProductService {

	addProduct(data, callback) {
		Product.create(data, callback);
	}

	findProductBySKU(sku, callback) {
		Product.findOne({ sku: sku}, callback);
	}

	updateProduct(sku, data, callback) {
		this.findProductBySKU(sku, (err, product) => {
			if (err) throw err;

			let updatedData = Object.assign(product, data);
			updatedData.save(callback);
		});
	}

	getAllProducts(query, limit, skip, callback) {
		if (typeof query === 'function') {
			callback = query;
			query = {};
			limit = 50;
			skip = 0;
		}

		if (typeof limit === 'function') {
			callback = limit;
			limit = 50;
			skip = 0;
		}

		if (limit > 50) {
			limit = 50;
		}

		Product.find(query).skip(skip).limit(limit).exec(callback);
	}

	removeProduct(sku, callback) {
		Product.remove({ sku: sku }, callback);
	}
}

module.exports = ProductService;