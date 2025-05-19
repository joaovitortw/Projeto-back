require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

const { Sequelize } = require('sequelize');
const config = require('./config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
