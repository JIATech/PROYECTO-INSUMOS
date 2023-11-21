// src/middleware/auth.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).send({
            error: 'Y el token!?'
        });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, 'clavesecreta', (error, decoded) => {
        if (error) {
            return res.status(401).json({
                message: 'El token no es válido'
            });
        } else {
            // Accede al ID del usuario desglosando el token en su parte de id 
            const userId = decoded.userId;

            // Almacena el ID del usuario en el objeto 'req' para su uso en las rutas protegidas
            req.userId = userId;
            
            next();
        }
    });
}

function checkToken(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);

        jwt.verify(token, 'clavesecreta', (error, decoded) => {
            if (!error) {
                req.isTokenValid = true;
                req.userId = decoded.userId;
            } else {
                req.isTokenValid = false;
            }
            next();
        });
    } else {
        req.isTokenValid = false;
        next();
    }
}

module.exports = {
    verifyToken,
    checkToken
};