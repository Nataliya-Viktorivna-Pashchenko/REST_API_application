const Joi = require("joi");

const userSchemaAdd = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required(),
subscription: Joi.string()
})



const validateUser = (reqBody) => {
    const { error } = userSchemaAdd.validate(reqBody, {
      errors: { wrap: { label: false } },
      messages: { "any.required": "missing required {{#label}} field" },
    });
  if (error) {
    error.status = 400;
    throw error;
  }
}



module.exports = {validateUser};