import { body } from 'express-validator';

export const registerValidator = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('First name must be between 2 and 100 characters'),

    body('birthDate')
        .isISO8601()
        .withMessage('Valid birth date is required')
        .custom((value) => {
            const age = new Date().getFullYear() - new Date(value).getFullYear();
            if (age < 18) {
                throw new Error('You must be at least 18 years old');
            }
            return true;
        }),

    body('gender')
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),

    body('interestedIn')
        .isIn(['Male', 'Female', 'Both'])
        .withMessage('InterestedIn must be Male, Female, or Both')
];

export const loginValidator = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];