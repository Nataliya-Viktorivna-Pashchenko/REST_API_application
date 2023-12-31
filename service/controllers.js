const Contacts = require('../models/contacts');
const validateBody = require('./validate');
const wrapperCtrl = require('./wrapperCtrl');
const HttpError = require('./HttpError')

const getAll = async (req, res) => {
          const contacts = await Contacts.listContacts();
      res.json(contacts);
  }

  const getById = async (req, res) => {
         const contact = await Contacts.getContactById (req.params.id)
      if (!contact) {
        const message = res.json ({"message": "Not found"});
        throw HttpError(404, message);
        }
    res.json(contact);
  }

const add = async (req, res) => {
  validateBody.validateBody(req.body);
      const contact =await Contacts.addContact(req.body);
    res.status(201).json(contact);
 }

 const deleteById = async (req, res) => {
    const result = await Contacts.removeContact(req.params.id)
  if (!result) {
    const message = res.json({"message": "Not found"})
    throw HttpError(404, message);
  }
  res.status(200).json({"message": "contact deleted"});
}

const put = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.json({"message": "missing fields"});
  }
  validateBody.validateBody(req.body);
    const result = await Contacts.updateContactById(req.params.id, req.body);
    if (!result) {
      const message = res.json({"message": "Not found"})
      throw HttpError(404, message);
    }
    res.status(200).json(result);
}

  module.exports = {
    getAll: wrapperCtrl(getAll),
    getById: wrapperCtrl(getById),
    add: wrapperCtrl(add),
    deleteById: wrapperCtrl(deleteById),
    put: wrapperCtrl(put)
  }