const validateBody = require('../service/validateContacts');
const wrapperCtrl = require('../service/wrapperCtrl');
const Contact =  require('../models/contact');
const validateFavorite = require('../service/validateContacts');

const getAll = async (req, res) => {
  const userId = req.user._id;
          const contacts = await Contact.find({owner: userId});
      res.json(contacts);
  }

  const getById = async (req, res) => {
    const userId = req.user._id;
         const contact = await Contact.findById (req.params.id)
      if (contact === null || contact.owner.toString() !== userId) {
        res.status(404).json({"message": "Not found"});
        }
      
    res.json(contact);
  }

const add = async (req, res) => {
  validateBody.validateBody(req.body);
  const newContact = { 
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    owner: req.user._id
  }
      const contact =await Contact.create(newContact);
    res.status(201).json(contact);
 }

 const deleteById = async (req, res) => {
  const userId = req.user._id;
  const contact = await Contact.findById (req.params.id)
if (contact === null || contact.owner.toString() !== userId) {
 res.status(404).json({"message": "Not found"});
 }
     await Contact.findByIdAndDelete(req.params.id)
  res.status(200).json({"message": "contact deleted"});
}

const put = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).json({"message": "missing fields"});
  }
  validateBody.validateBodyUpdate(req.body);
  const userId = req.user._id;
  const contact = await Contact.findById (req.params.id)
if (contact === null || contact.owner.toString() !== userId) {
 res.status(404).json({"message": "Not found"});
 }
    const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true});
       res.status(200).json(result);
}

const changeFavorite = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).json({"message": "missing field favorite"});
  }
  validateFavorite.validateFavorite(req.body);
  const userId = req.user._id;
  const contact = await Contact.findById (req.params.id)
if (contact === null || contact.owner.toString() !== userId) {
 res.status(404).json({"message": "Not found"});
 }
    const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(result);
}

  module.exports = {
    getAll: wrapperCtrl(getAll),
    getById: wrapperCtrl(getById),
    add: wrapperCtrl(add),
    deleteById: wrapperCtrl(deleteById),
    put: wrapperCtrl(put),
    changeFavorite: wrapperCtrl(changeFavorite),
  }