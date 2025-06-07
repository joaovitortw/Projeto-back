// Importa o Supertest para simular requisições HTTP
const request = require('supertest');

// Importa o app da aplicação (Express)
const app = require('../app');

// Importa os modelos e a conexão do banco (Sequelize)
const db = require('../models');

// Grupo de testes: Revogação de sessões específicas
describe('Sessões - Revogar Sessão Específica', () => {
    
    // Usuário de teste que será criado no banco
    const usuarioTeste = {
        login: 'revogar@email.com',
        senha: '123456',
        tipo: 'professor'
    };

    // Variáveis auxiliares para armazenar cookies, tokens e ID do usuário
    let cookies = '';
    let refreshTokenCriado;
    let userId;

    // beforeAll roda antes de todos os testes
    beforeAll(async () => {
        // Limpa tokens e usuários com mesmo login para evitar conflitos
        await db.RefreshToken.destroy({ where: {} });
        await db.User.destroy({ where: { login: usuarioTeste.login } });

        // Criptografa a senha antes de salvar
        const bcrypt = require('bcryptjs');
        const senhaCriptografada = await bcrypt.hash(usuarioTeste.senha, 10);

        // Cria o usuário no banco
        const usuario = await db.User.create({
            login: usuarioTeste.login,
            senha: senhaCriptografada,
            tipo: usuarioTeste.tipo
        });

        userId = usuario.id;

        // Realiza login para gerar sessão e obter cookie de autenticação
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ login: usuarioTeste.login, senha: usuarioTeste.senha });

        // Armazena o cookie da resposta
        cookies = loginRes.headers['set-cookie'];

        // Captura o refresh token gerado para esse login
        refreshTokenCriado = await db.RefreshToken.findOne({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    });

    // afterAll roda após todos os testes
    afterAll(async () => {
        // Limpa tokens e usuário criado
        await db.RefreshToken.destroy({ where: {} });
        await db.User.destroy({ where: { id: userId } });

        // Encerra a conexão com o banco
        await db.sequelize.close();
    });

    // Teste 1: Revogação com sucesso de uma sessão específica
    it('Deve revogar uma sessão específica com sucesso', async () => {
        const res = await request(app)
            .delete(`/api/sessoes/${refreshTokenCriado.id}`)
            .set('Cookie', cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');

        // Verifica se o token foi realmente removido do banco
        const token = await db.RefreshToken.findByPk(refreshTokenCriado.id);
        expect(token).toBeNull();
    });

    // Teste 2: Tentativa de revogação com ID inválido
    it('Deve retornar erro se o ID for inválido', async () => {
        const res = await request(app)
            .delete(`/api/sessoes/abc`)
            .set('Cookie', cookies);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('erro');
    });

    // Teste 3: Tentativa de revogar sessão de outro usuário
    it('Deve retornar erro se a sessão não pertencer ao usuário', async () => {
        // Cria outro usuário
        const outroUsuario = await db.User.create({
            login: 'invasor@email.com',
            senha: await require('bcryptjs').hash('senha999', 10),
            tipo: 'professor'
        });

        // Cria uma sessão falsa para esse outro usuário
        const outraSessao = await db.RefreshToken.create({
            userId: outroUsuario.id,
            token: 'token-falso',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
        });

        // Tenta revogar com as credenciais do usuário original
        const res = await request(app)
            .delete(`/api/sessoes/${outraSessao.id}`)
            .set('Cookie', cookies);

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('erro');

        // Limpa dados do teste
        await db.RefreshToken.destroy({ where: { id: outraSessao.id } });
        await db.User.destroy({ where: { id: outroUsuario.id } });
    });
});
