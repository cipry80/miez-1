'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();

const productFixture = require('../fixtures/product');
const ProductService = require('../../app/services/product.service');

describe('Product Service', function(){
	let mongoose; 
	let productService;

	before(function(done) {
		mongoose = require('../../config/mongoose').init();
		productService = new ProductService();
		done();
	});

	it('should instantiate a new Product Service', (done) => {
		should.exist(productService);
		done();
	});

	it('should add a new product', (done) => {
		productService.addProduct(productFixture, (err, product) => {
			if (err) throw err;

			should.exist(product);
			product.sku.should.equal(productFixture.sku);
			product.title.should.equal(productFixture.title);
			product.slug.should.equal('choco-caramel-minis');
			product.price.value.should.equal(5.99);
			done();
		});
	});

	// it should not add products with duplicate ids

	it("should find product by sku", (done) => {
		productService.findProductBySKU(productFixture.sku, (err, product) => {
			if (err) throw err;

			should.exist(product);
			product.sku.should.equal(productFixture.sku);
			done();
		});
	});

	it("should update product by sku", (done) => {
		const newProductTitle = { title: 'Mister Choc - Choco & Caramel Minis' };

		productService.updateProduct(productFixture.sku, newProductTitle, (err, product) => {
			if (err) throw err;

			product.sku.should.equal(productFixture.sku);
			product.title.should.equal(newProductTitle.title);
			product.slug.should.equal('mister-choc-choco-caramel-minis');
			done();
		});

	});

	// it should update sku
});