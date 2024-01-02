const Joi = require("joi");

const contactSchemaAdd = Joi.object({
name: Joi.string().required(),
email: Joi.string().email().required(),
phone: Joi.string().required(),
})
const contactSchemaUpdate = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  })

const validateBody = (reqBody) => {
    const { error } = contactSchemaAdd.validate(reqBody, {
      errors: { wrap: { label: false } },
      messages: { "any.required": "missing required {{#label}} field" },
    });
  if (error) {
    error.status = 400;
    throw error;
  }
}

const validateBodyUpdate = (reqBody) => {
  const {error} = contactSchemaUpdate.validate(reqBody);
if (error) {
  error.status = 400;
  throw error;
}
}

module.exports = {validateBody, validateBodyUpdate};