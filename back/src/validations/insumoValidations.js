const { check, validationResult } = require('express-validator')

const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        res.status(403)
        res.send({ errors: err.array() })
    }
}

// Validaciones input:
const validacionesInsumos = [
    check('insumo')
    .exists()
    .not()
    .isEmpty()
    .isAlphanumeric()
    .isLength({min: 3})
    .withMessage('El nombre debe tener al menos 3 caracteres'),
    check('precio')
    .exists()
    .not()
    .isEmpty()
    .isNumeric(),
    check('stock')
    .exists()
    .not()
    .isEmpty()
    .isNumeric(),

    (req, res, next) => {
       validateResult(req, res, next)
    }
 ]


 module.exports = { validacionesInsumos };