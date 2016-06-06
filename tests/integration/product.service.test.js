'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();

var productFixture = require('../fixtures/product');
var ProductService = require('../../app/services/product.service');

describe('Product Service', function(){
	var mongoose, 
	productModel,
	productService;

	before(function(done) {
		mongoose = require('../../config/mongoose').init();
		productModel = require('../../app/models/product');
		productService = new ProductService();
		done();
	});

	it('should instantiate a new Product Service', (done) => {
		should.exist(productService);
		done();
	});
});