import { body } from 'express-validator';

export const updateProfileValidator = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('First name must be between 2 and 100 characters'),

    body('lastName')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Last name must not exceed 100 characters'),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),

    body('occupation')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Occupation must not exceed 100 characters'),

    body('education')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Education must not exceed 100 characters'),

    body('height')
        .optional()
        .isInt({ min: 100, max: 250 })
        .withMessage('Height must be between 100 and 250 cm'),

    body('city')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('City must not exceed 100 characters'),

    body('country')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Country must not exceed 100 characters')
];