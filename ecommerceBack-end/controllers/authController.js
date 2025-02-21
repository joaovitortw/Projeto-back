const bcrypt = require('bcryptjs');
const { User } = require('../models');

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

            return res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            return res.status(500).json({ error: 'Login failed', details: error.message });
        }
    },
};
