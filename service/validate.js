const Joi = require("joi");

const contactSchemaAdd = Joi.object({
name: Joi.string().required(),
email: Joi.string().email().required(),
phone: Joi.string().required(),
})

const validateBody = (reqBody) => {
    const {error} = contactSchemaAdd.validate(reqBody);
  if (error) {
    error.status = 400;
    throw error;
  }
}

module.exports = validateBody;