export function autorizar (...tiposPermitidos){
    return (req, res, next) => {
        const usuario = (req).usuario;

        if (!usuario || !tiposPermitidos.includes(usuario.tipo)) {
            res.status(403).json({erro: 'Acesso negado' })
            return;
        }
        
        next();
    };
}