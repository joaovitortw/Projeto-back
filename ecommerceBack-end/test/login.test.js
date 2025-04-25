const login = require('./login');

test('Login com credenciais corretas deve retornar true', () => {
    expect(login('admin', '1234')).toBe(true);
});

test('Login com senha incorreta deve retornar false', () => {
    expect(login('admin', 'errada')).toBe(false);
});

test('Login com campos vazios deve retornar false', () => {
    expect(login('', '')).toBe(false);
});
