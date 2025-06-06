import request from 'supertest';
import app from '../app';
import { prisma } from '../models';

describe('Testes de Segurança - Autenticação', () => {
  const usuarioTeste = {
    login: 'usuario_seguro',
    senha: 'senhaSegura123',
    confirmSenha: 'senhaSegura123',
    tipo: 'cliente'
  };

  beforeAll(async () => {
    await prisma.uni_login.deleteMany({ where: { login: usuarioTeste.login } });

    await request(app)
      .post('/auth/register')
      .send(usuarioTeste);
  });

  afterAll(async () => {
    await prisma.uni_login.deleteMany({ where: { login: usuarioTeste.login } });
    await prisma.$disconnect();
  });

  it('❌ Deve retornar erro ao tentar login com senha incorreta', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ login: usuarioTeste.login, senha: 'senhaErrada' });

    expect(res.status).toBe(401); // ou 403 se o seu controller usar outro código
    expect(res.body).toHaveProperty('error');
  });

  it('❌ Deve bloquear acesso à rota protegida sem token', async () => {
    const res = await request(app)
      .get('/sessoes'); // troque se sua rota protegida tiver outro caminho

    expect([401, 403]).toContain(res.status);
    expect(res.body).toHaveProperty('error');
  });
});
