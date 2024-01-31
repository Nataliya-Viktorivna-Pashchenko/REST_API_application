const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new mongoose.Schema({
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
        favorite: {
          type: Boolean,
          default: false,
        },
},
{versionKey: false},);

contactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Contact", contactSchema);