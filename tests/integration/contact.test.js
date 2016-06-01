'use strict';

// Set the environment to test
process.env.NODE_ENV = 'test';

const http = require('http');
const request = require('request');

const chai = require('chai');
const should = chai.should();

const userFixture = require('../fixtures/user');
const config = require('../../config/environments/test');

describe('Contact', function() {
	let app,
			appServer,
			config,
			baseUrl,
			mongoose,
			Contact,
			User,
			newContactData = {
				email: 'new_contact@test.com',
				name: 'New Contact',
				city: 'Cluj-Napoca',
				phone: '0123456789',
				company: 'SIIT'
			},
			_contact;

	before(function(done) {
		app = require('../../server');
		config = app.get('config');
		baseUrl = config.baseUrl;
		appServer = http.createServer(app);

		appServer.on('listening', () => {
			mongoose = app.get('mongoose');
			User = mongoose.model('User');
			Contact = mongoose.model('Contact');

			User.create(userFixture, (err, user) => {
				if (err) throw err;

				request({
					method: 'POST',
					url: baseUrl + '/auth/signin',
					form: {
						'email': userFixture.email,
						'password': 'user_password'
					},
					json: true,
					jar: true
				}, (err, res, body) => {
					if (err) throw err;

					done();
				});
			});

		});

		appServer.listen(config.port);
	});

	after(function(done) {
		appServer.on('close', function() {
      setTimeout(function() { 
      	done(); 
      }, 1000);
    });

		Contact.remove({}).exec((err) => {
			if (err) throw err;
			
			User.remove({}).exec((err) => {
				if (err) throw err;

				mongoose.connection.close(function() {
					appServer.close();
				});
			});
		});
	});

	it('should add a new contact', function(done) {
		request({
			method: 'POST',
			url: baseUrl + '/api/contacts',
			body: newContactData,
			json: true,
			jar: true
		}, (err, res, body) => {
			if (err) throw err;

			_contact = res.body;

			res.statusCode.should.equal(200);
			res.body.email.should.equal(newContactData.email);
			res.body.name.should.equal(newContactData.name);
			res.body.city.should.equal(newContactData.city);
			res.body.phone.should.equal(newContactData.phone);
			res.body.company.should.equal(newContactData.company);

			done();
		});
	});

	it('should get all contacts', function(done) {
		request({
			method: 'GET',
			url: baseUrl + '/api/contacts',
			json: true,
			jar: true
		}, (err, res, body) => {
			if (err) throw err;

			res.statusCode.should.equal(200);
			res.body.length.should.equal(1);
			done();
		});
	});

	it('should get a contact by id', function(done) {
		request({
			method: 'GET',
			url: baseUrl + '/api/contacts/' + _contact._id,
			json: true,
			jar: true
		}, (err, res, body) => {
			if (err) throw err;

			res.statusCode.should.equal(200);
			body.email.should.equal(newContactData.email);
			body.name.should.equal(newContactData.name);
			body.city.should.equal(newContactData.city);
			body.phone.should.equal(newContactData.phone);
			body.company.should.equal(newContactData.company);

			done();
		});
	});

	it('should update a contact', function(done) {
		request({
			method: 'PUT',
			url: baseUrl + '/api/contacts/' + _contact._id,
			body: {
				email: 'new_email@test.com'
			},
			json: true,
			jar: true
		}, (err, res, body) => {
			if (err) throw err;

			res.statusCode.should.equal(200);

			body.email.should.equal('new_email@test.com');
			body.name.should.equal(newContactData.name);
			body.city.should.equal(newContactData.city);
			body.phone.should.equal(newContactData.phone);
			body.company.should.equal(newContactData.company);

			done();
		});
	});

	it('should delete a contact', function(done) {
		request({
			method: 'DELETE',
			url: baseUrl + '/api/contacts/' + _contact._id,
			json: true,
			jar: true
		}, (err, res, body) => {
			if (err) throw err;

			res.statusCode.should.equal(204);
			done();
		});
	});

	it('should retrieve no contacts after delete', function(done) {
		request({
			method: 'GET',
			url: baseUrl + '/api/contacts',
			json: true,
			jar: true
		}, (err, res, body) => {
			if (err) throw err;

			res.statusCode.should.equal(200);
			body.length.should.equal(0);
			done();
		});
	});
});