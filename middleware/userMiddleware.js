const jwt = require('jsonwebtoken');
require('dotenv').config();

// Membuat Akses Token dan Request Token
exports.generateTokens = (user) => {
    const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET); 

    return { accessToken, refreshToken };
};


exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Mengambil token dari header Authorization

    if (!token) {
        return res.status(403).json({ message: 'Token tidak ditemukan, akses ditolak' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid, akses ditolak' });
        }

        req.user = user; // Menyimpan user ke request object
        next(); // Lanjut ke handler route berikutnya
    });
};

// Middleware untuk membuat Akses Token baru menggunakan Request Token
exports.refreshToken = (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Request Token tidak ada' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Request Token tidak valid' });

        const newAccessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    });
};
