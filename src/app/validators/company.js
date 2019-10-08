const Yup = require('yup');

const schema = Yup.object().shape({
  cnpj: Yup.string().required(),
  // .max(15)
  // .min(15),
  email: Yup.string()
    .email()
    .required(),
  email_repeat: Yup.string().when('email', (email, field) =>
    email ? field.required().oneOf([Yup.ref('email')]) : field
  ),
  phone: Yup.string()
    .required()
    .min(11)
    .max(11)
});

module.exports = schema;
