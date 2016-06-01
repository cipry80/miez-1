'use strict';

const mongoose = require('mongoose');
const Contact = mongoose.model('Contact');
const ObjectId = mongoose.Types.ObjectId;

module.exports.getAll = getAllContacts;
module.exports.findById = findContactById;
module.exports.create = createContact;
module.exports.update = updateContact;
module.exports.delete = deleteContact;

function getAllContacts(req, res, next) {
	Contact.find((err, contacts) => {
		if (err) {
			return next(err);
		}

		req.resources.contacts = contacts;
		next();
	});
}

function findContactById(req, res, next) {
	if (!ObjectId.isValid(req.params.contactId)){
		return res.status(404).json({ message: "contact not found" });
	};

	Contact.findById(req.params.contactId, (err, contact) => {
		if (err) {
			next(err);
		} else if (contact) {
			req.resources.contact = contact;
			next();
		}
		else {
			next(new Error('failed to find contact'));
		}
	});
}

function createContact(req, res, next) {
	const contact = Object.assign({}, req.body);
	contact.user = req.user._id;

	Contact.create(contact, (err, createdContact) => {
		if (err) {
			return next(err);
		}

		req.resources.contact = createdContact;
		next();
	});
}

function updateContact(req, res, next) {
	let contact = req.resources.contact;
	contact = Object.assign(contact, req.body);

	contact.save((err, updatedContact) => {
		if (err) {
			return next(err);
		}

		req.resources.contact = updatedContact;
		next();
	});
}

function deleteContact(req, res, next) {
	req.resources.contact.remove(err => {
    if (err) {
      return next(err);
    }

    res.status(204).json();
  });
}