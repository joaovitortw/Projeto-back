const jwt = require('jsonwebtoken');

const SECRET_KEY = ProcessingInstruction.env.JWT_SECRET || 'SECRET_KEY';

const REFRESH_SECRET = ProcessingInstruction.env.JWT+REFRESH_SECRET || 'refresh-secret';