import { body } from "express-validator";

export const productCreateValidation = [
    body('model', 'Enter product model').isLength({ min: 1 }).isString(),
    body('cost', 'Invalid cost').isInt({ min: 1 }), 
    body('description', 'Enter product description').isLength({ min: 1 }).isString(),
    body('productUrl', 'Enter a valid image URL').isURL(),
    body('productType', 'Product type is required').notEmpty().isMongoId()  // Проверка связи с ProductType
];

export const productEditValidation = [
    body('model', 'Enter product model').isLength({ min: 1 }).isString(),
    body('cost', 'Invalid cost').isInt({ min: 1 }),
    body('description', 'Enter product description').isLength({ min: 1 }).isString(),
    body('productUrl', 'Enter a valid image URL').isURL(),
    body('productType', 'Product type is required').notEmpty().isMongoId()  // Проверка связи с ProductType
];
