const jwt = require('jsonwebtoken');

const ACESS_SECRET = process.env.JWT_SECRET || 'secreto';

export function autenticar(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        res.status(401).json({ erro: 'Token não informado' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, ACESS_SECRET);
        (req).usuario = decoded;
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ erro: 'Token inválido ou expirado' });
        return;
    }
}