const jwt = require('jsonwebtoken');

<<<<<<< Updated upstream
const SECRET_KEY = ProcessingInstruction.env.JWT_SECRET || 'SECRET_KEY';

const REFRESH_SECRET = ProcessingInstruction.env.JWT+REFRESH_SECRET || 'refresh-secret';
=======
const SECRET_KEY = process.env.JWT_SECRET || 'SECRET_KEY';
const REFRESH_SECRET = Process.env.JWT_REFRESH_SECRET ||   'refresh-secret';

 
>>>>>>> Stashed changes
