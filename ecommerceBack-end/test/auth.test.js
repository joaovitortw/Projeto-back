// Importa o supertest para fazer requisições HTTP simuladas
const request = require('supertest');

// Importa a aplicação Express (geralmente exportada de app.js ou index.js)
const app = require('../app');

// Importa os modelos e a conexão com o banco de dados (ORM Sequelize)
const db = require('../models');

// Início do grupo de testes
describe('Auth Endpoints com dados reais do banco', () => {

    // Define um usuário que deve existir previamente no banco de dados
    const userDB = {
        login: 'admin',
        senha: '123456'
    };

    // Teste 1: Login com sucesso usando credenciais válidas
    it('Deve realizar login com usuário existente no banco', async () => {
        const res = await request(app) // Simula uma requisição HTTP
            .post('/api/auth/login')   // Rota que será testada
            .send({                    // Envia os dados de login
                login: userDB.login,
                senha: userDB.senha
            });

        // Verifica se o status da resposta é 200 (OK)
        expect(res.statusCode).toBe(200);

        // Verifica se o corpo da resposta contém a mensagem de sucesso
        expect(res.body).toHaveProperty('message', 'Login realizado com sucesso!');

        // Verifica se o objeto user retornado tem o login correto
        expect(res.body.user).toHaveProperty('login', userDB.login);
    });

    // Teste 2: Login falha com senha incorreta
    it('Deve falhar no login com senha incorreta', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                login: userDB.login,
                senha: 'senhaErrada' // senha errada propositalmente
            });

        // Deve retornar erro de autenticação
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Login ou senha inválidos');
    });

    // Teste 3: Login falha com usuário inexistente
    it('Deve falhar no login com usuário inexistente', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                login: 'naoexiste',   // usuário que não existe
                senha: '123456'
            });

        // Deve retornar erro de autenticação
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Login ou senha inválidos');
    });

    // Após todos os testes, encerra a conexão com o banco
    afterAll(async () => {
        // Dá uma pequena pausa para evitar erros de encerramento
        await new Promise(resolve => setTimeout(() => resolve(), 100));

        // Fecha a conexão do Sequelize com o banco de dados
        await db.sequelize.close();
    });

});
