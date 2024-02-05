const Joi = require("joi");

const userSchemaAdd = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required(),
subscription: Joi.string()
})

const updateUserSubscription = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business')
})

const sendEmailAgain = Joi.object({
  email: Joi.string().email().required(),
})

const validateEmail = (reqBody) => {
  const { error } = sendEmailAgain.validate(reqBody, {
    errors: {wrap: { label:false}},
    messages: { "any.required": "missing required {{#label}} field" }
  });
  if (error) {
    error.status = 400;
    throw error;
  }
  }
  
const validateSubscription = (reqBody) => {
const { error } = updateUserSubscription.validate(reqBody, {
  errors: {wrap: { label:false}},
  messages: { "any.required": "missing required {{#label}} field" }
});
if (error) {
  error.status = 400;
  throw error;
}
}


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



module.exports = {validateUser, validateSubscription, validateEmail};