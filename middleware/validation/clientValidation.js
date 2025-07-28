const { body } = require('express-validator');

exports.clientValidation = [
  body('name').notEmpty().withMessage('Client name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
];
