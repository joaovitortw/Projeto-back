function login(username, password) {
    if (!username || !password) {
    return false;
    }
    if (username === 'admin' && password === '1234') {
    return true;
    }
    return false;
    }