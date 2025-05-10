const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { verificarRefreshToken } = require('../services/jwt_service');

module.exports = {
    async register(req, res) {
        const { name, username, password, confirmPassword } = req.body;

        try {
            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords do not match' });
            }

            const userExists = await User.findOne({ where: { username } });

            if (userExists) {
                return res.status(400).json({ error: 'Username already taken' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({ name, username, password: hashedPassword });
            return res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            return res.status(500).json({ error: 'Registration failed', details: error.message });
        }
    },

    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const payload = {
                id: user.id,
                email: user.email,
                tipo: user.tipo,
            };

            const accessToken = gerarAccessToken(payload);

            const refreshToken = gerarRefreshToken(payload);

            return res.status(200).json({
                accessToken,
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.tipo,
                },
            });



        } catch (error) {
            return res.status(500).json({ error: 'Login failed', details: error.message });
        }

    },
    async refresh(req, res) {
        const { refreshToken } = req.body;
        if (refreshToken) throw new HttpError(400, 'Refresh token não enviado.');

        const decoded = verificarRefreshToken(refreshToken);

        const user = await user.findUnique({
            where: { id: decoded.id }
        });

        if (!user || user.refreshToken !== refreshToken) {
            throw new HttpError(403, 'Refresh Token invalido.');
        }

        const payload = {
            id: user.id,
            email: user.email,
            tipo: user.tipo,
        };

        const novoAcessToken = gerarAccessToken(payload);
        res.json({ accessToken: novoAcessToken });
    },

    async logout(req, res) {
        const { refreshToken } = req.body;

        const decoded = verificarRefreshToken(refreshToken);

        await user.update({
            where: { id: decoded.id },
            data: { refreshToken: null }
        });

        res.json({ mensagem: 'logout realizado com sucesso.' });
    }
};
