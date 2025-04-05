const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const chavesecreta = process.env.SECRET_KEY || 'SECRET_KEY';

function gerartokenjwt(dadosusuario){
    return jwt.sign(dadosusuario,chavesecreta,{expiresIn: '1h' });
}

function verificarTokenJWT(token){
    try{
        return jwt.verify(token, chavesecreta);
    } catch (error){
        console.error("Erro ao verificar token JWT:", (error).message);
        return null;
    }
}
 
const dadosUduarioAltenticado = {
    id: 24,
    nome: 'Kaua viado'
};

const tokenJWT = gerartokenjwt(dadosUduarioAltenticado);

console.log("Token JWT gerado:", tokenJWT);