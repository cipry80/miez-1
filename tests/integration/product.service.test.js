'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();

const productFixture = require('../fixtures/product');
const ProductService = require('../../app/services/product.service');

describe('Product Service', function(){
	let mongoose; 
	let productService;
	let Product;

	before(function(done) {
		mongoose = require('../../config/mongoose').init();
		Product = mongoose.model('Product');
		productService = new ProductService();
		done();
	});

	after(function(done) {
		Product.remove({}).exec((err) => {
			if (err) throw err;
			mongoose.connection.close();
			done();
		});
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

	it('should not add products with duplicate skus', (done) => {
		productService.addProduct(productFixture, (err, product) => {
			should.exist(err);
			err.code.should.equal(11000);
			done();
		});
	});

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

	it("should update product sku", (done) => {
		const newSku = { sku: '1234567890' };

		productService.updateProduct(productFixture.sku, newSku, (err, product) => {
			if (err) throw err;

			product.sku.should.equal(newSku.sku);
			done();
		});
	});


	it("should get all products", (done) => {
		productService.getAllProducts((err, products) => {
			if (err) throw err;

			products.length.should.equal(1);
			done();
		});
	});

	// TODO: add more tests for get all products

	it("should remove product by sku", (done) => {
		productService.removeProduct('1234567890', (err) => {
			if (err) throw err;

			productService.getAllProducts((err, products) => {
				if (err) throw err;

				products.length.should.equal(0);
				done();
			});
		})
	});
});