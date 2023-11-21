const { check, validationResult } = require('express-validator')

/**
 * Middleware para validar el resultado de las validaciones.
 * Captura y devuelve errores de validación en la solicitud.
 */
const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        res.status(403)
        res.send({ errors: err.array() })
    }
}

// Validaciones inputs para cargarUsuario:
const validacionesInputs = [
    // Verifica que el email exista, no esté vacío y sea un email válido.
    check('email')
    .exists()
    .not()
    .isEmpty()
    .isEmail(),
    // Verifica que el usuario exista, no esté vacío y sea alfanumérico.
    check('usuario')
    .exists()
    .not()
    .isEmpty()
    .isAlphanumeric(),
    // Verifica que el password exista, no esté vacío y sea alfanumérico.
    check('password')
    .exists()
    .not()
    .isEmpty()
    .isAlphanumeric(),
 
    // Middleware para procesar y devolver los resultados de las validaciones.
    (req, res, next) => {
       validateResult(req, res, next)
    }
 ]

// Validaciones para los inputs al iniciar sesión.
const validacionLogin = [
    // Verifica que el usuario exista, no esté vacío y sea alfanumérico.
    check('usuario')
    .exists()
    .not()
    .isEmpty(),
    // Verifica que el password exista, no esté vacío y sea alfanumérico.
    check('password')
    .exists()
    .not()
    .isEmpty()
    .isAlphanumeric(),

    // Middleware para procesar y devolver los resultados de las validaciones.
    (req, res, next) => {
        validateResult(req, res, next)
     }
]


 module.exports = { validacionesInputs, validacionLogin }