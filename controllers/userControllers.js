const bcrypt = require('bcrypt');
const User = require('../models/userModels');
const userService = require('../services/userServices');
const userMiddleware = require('../middleware/userMiddleware');

// Login
exports.Postlogin = async (req, res) => {
    try {

        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Email dan Password harus diisi' });
        }
        
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log(user);
            return res.status(404).json({ message: 'Email tidak ditemukan', user: user});
        }
        const isMatch = bcrypt.compare(req.body.password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }
        //Token
        const { accessToken, refreshToken } = userMiddleware.generateTokens(user);

        res.status(200).json({
            message: 'Login berhasil',
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Terjadi kesalahan', errors: err });
    }
};

// Get Semua User (dengan autentikasi)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data pengguna', error: err });
    }
};

// Create User
exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const user = await newUser.save(); 
        res.status(201).json(user); 
    } catch (err) {
        res.status(500).json({ message: 'Gagal membuat pengguna', error: err });
    }
};

// Get User by Nama
exports.getUserByName = async (req, res) => {
    try {
        const user = await userService.findUserByName(req.body.nama);
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: err });
    }
};

// Edit User (dengan autentikasi)
exports.editUser = async (req, res) => {
    try {
        const user = await userService.findUserByEmail(req.body.email);
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengedit pengguna', error: err });
    }
};

// Update User by Id (dengan autentikasi)
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Gagal memperbarui pengguna', error: err });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.body._id });
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        await user.remove();
        res.status(200).json({ message: 'Pengguna berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menghapus pengguna', error: err });
    }
};
