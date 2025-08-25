import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
});

const userUpdateSchema = Joi.object({
  newValue: Joi.string().min(3).required(),
});

function validateInput(input, method) {
  if (method === "update") {
    const { error } = userUpdateSchema.validate(input);
    if (error) throw new Error(error.details[0].message);
  } else {
    const { error } = userSchema.validate(input);
    if (error) throw new Error(error.details[0].message);
  }
}
export default validateInput
