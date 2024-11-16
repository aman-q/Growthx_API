import { body } from "express-validator";

export const userLoginValidator = [
    body('email').isEmail().withMessage("Valid Email is require"),
    body('password').notEmpty().withMessage('Password is required'),
  ];

export const userRegistrationValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ max: 15 }).withMessage('UserName should not exceed 15 characters'),
  body('email')
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const validateUploadTask = [
    body("task")
        .notEmpty().withMessage("Task is required")
        .isString().withMessage("Task must be a string"),
    body("adminName")
        .notEmpty().withMessage("Admin name is required")
        .isString().withMessage("Admin name must be a string"),
];