const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sessoesRoutes = require('./routes/sessoes.routes');


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/sessoes', sessoesRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
