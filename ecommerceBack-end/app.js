const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const cookieParser = require('cookie-parser');
const painelRoutes = require('./routes/painel.routes'); 

app.use(cookieParser());
app.use('/painel', painelRoutes);


module.exports = app;
