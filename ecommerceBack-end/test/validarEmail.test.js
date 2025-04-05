const { validarEmail } = require('./validarEmail'); // Importação correta

test('Email válido deve retornar true', () => {
    expect(validarEmail('email@teste.com')).toBe(true);
});

test('Email sem @ deve retornar false', () => {
    expect(validarEmail('emailerrado.com')).toBe(false);
});

test('Email sem domínio deve retornar false', () => {
    expect(validarEmail('email@errado')).toBe(false);
});
