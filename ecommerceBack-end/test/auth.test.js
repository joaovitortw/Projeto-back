const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Auth Endpoints com dados reais do banco', () => {
    const userDB = {
        login: 'admin',
        senha: '123456'
    };

    it('Deve realizar login com usuário existente no banco', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ login: userDB.login, senha: userDB.senha });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Login realizado com sucesso!');
        expect(res.body.user).toHaveProperty('login', userDB.login);
    });

    it('Deve falhar no login com senha incorreta', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ login: userDB.login, senha: 'senhaErrada' });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Login ou senha inválidos');
    });

    it('Deve falhar no login com usuário inexistente', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ login: 'naoexiste', senha: '123456' });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Login ou senha inválidos');
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 100)); // pequena pausa
        await db.sequelize.close(); // fecha conexão com banco
    });

});