// const Contacts = require('../models/contacts');
const validateBody = require('./validate');
const wrapperCtrl = require('./wrapperCtrl');
const Contact =  require('../models/contact');
const validateFavorite = require('./validate');
const isValidId = require('./isValidId')

const getAll = async (req, res) => {
          const contacts = await Contact.find();
      res.json(contacts);
  }

  const getById = async (req, res) => {
         const contact = await Contact.findById (req.params.id)
      if (!contact) {
        res.status(404).json({"message": "Not found"});
        }
    res.json(contact);
  }

const add = async (req, res) => {
  validateBody.validateBody(req.body);
      const contact =await Contact.create(req.body);
    res.status(201).json(contact);
 }

 const deleteById = async (req, res) => {
    const result = await Contact.findByIdAndDelete(req.params.id)
  if (!result) {
       res.status(404).json({"message": "Not found"});
  }
  res.status(200).json({"message": "contact deleted"});
}

const put = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).json({"message": "missing fields"});
  }
  validateBody.validateBodyUpdate(req.body);
    const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!result) {
      res.status(404).json({"message": "Not found"});
    }

    res.status(200).json(result);
}

const changeFavorite = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).json({"message": "missing field favorite"});
  }
  validateFavorite.validateFavorite(req.body);
    const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!result) {
      res.status(404).json({"message": "Not found"});
    }
    res.status(200).json(result);
}

  module.exports = {
    getAll: wrapperCtrl(getAll),
    getById: wrapperCtrl(getById),
    add: wrapperCtrl(add),
    deleteById: wrapperCtrl(deleteById),
    put: wrapperCtrl(put),
    changeFavorite: wrapperCtrl(changeFavorite)
  }