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

			var updatedData = Object.assign(data, product);

			console.log(updatedData);

			product.save(updatedData, callback);
		});
	}

	getAllProducts(query, limit, skip, callback) {
		if (typeof query === 'function') {
			callback = query;
			query = {};
			limit = 50;
			skip = 0;
		}

		if (typeof limit === function) {
			callback = limit;
			limit = 50;
			skip = 0;
		}

		if (limit > 50) {
			limit = 50;
		}

		Product.find(query).skip(skip).limit(limit).exec(callback);
	};
}

module.exports = ProductService;