const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Sessões - Revogar Sessão Específica', () => {
    const usuarioTeste = {
        login: 'revogar@email.com',
        senha: '123456',
        tipo: 'professor'
    };

    let cookies = '';
    let refreshTokenCriado;
    let userId;

    beforeAll(async () => {
        // Limpa registros anteriores
        await db.RefreshToken.destroy({ where: {} });
        await db.User.destroy({ where: { login: usuarioTeste.login } });

        // Cria usuário com senha criptografada
        const bcrypt = require('bcryptjs');
        const senhaCriptografada = await bcrypt.hash(usuarioTeste.senha, 10);
        const usuario = await db.User.create({
            login: usuarioTeste.login,
            senha: senhaCriptografada,
            tipo: usuarioTeste.tipo
        });
        userId = usuario.id;

        // Login para gerar tokens e cookies
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ login: usuarioTeste.login, senha: usuarioTeste.senha });

        cookies = loginRes.headers['set-cookie'];

        // Aguarda token ser persistido no banco
        refreshTokenCriado = await db.RefreshToken.findOne({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    });

    afterAll(async () => {
        await db.RefreshToken.destroy({ where: {} });
        await db.User.destroy({ where: { id: userId } });
        await db.sequelize.close();
    });

    it('Deve revogar uma sessão específica com sucesso', async () => {
        const res = await request(app)
            .delete(`/api/sessoes/${refreshTokenCriado.id}`)
            .set('Cookie', cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');

        const token = await db.RefreshToken.findByPk(refreshTokenCriado.id);
        expect(token).toBeNull();
    });

    it('Deve retornar erro se o ID for inválido', async () => {
        const res = await request(app)
            .delete(`/api/sessoes/abc`)
            .set('Cookie', cookies);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('erro');
    });

    it('Deve retornar erro se a sessão não pertencer ao usuário', async () => {
        const outroUsuario = await db.User.create({
            login: 'invasor@email.com',
            senha: await require('bcryptjs').hash('senha999', 10),
            tipo: 'professor'
        });

        const outraSessao = await db.RefreshToken.create({
            userId: outroUsuario.id,
            token: 'token-falso',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        const res = await request(app)
            .delete(`/api/sessoes/${outraSessao.id}`)
            .set('Cookie', cookies);

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('erro');

        await db.RefreshToken.destroy({ where: { id: outraSessao.id } });
        await db.User.destroy({ where: { id: outroUsuario.id } });
    });
});
