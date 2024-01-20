const mongoose = require("mongoose");

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
module.exports = mongoose.model("Contact", contactSchema);