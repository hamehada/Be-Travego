"use strict";

const jwt = require('jsonwebtoken');
const connection = require('../../src/models/connection')
const bcrypt = require('bcrypt');

exports.login = function (req, res) {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password harus diisi.' });
    }

    // Query untuk mendapatkan data admin berdasarkan username
    const sqlQuery = "SELECT * FROM admin WHERE username = ?";
    connection.query(sqlQuery, [username], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Username tidak ditemukan.' });
        }

        const admin = results[0];

        // Verifikasi password
        bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memverifikasi password.' });
            }

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Password salah.' });
            }

            // Buat token JWT
            const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ token });
        });
    });
};

exports.check = function (req, res) {
    const token = req.headers['authorization'];
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(403).json({ success: false, message: 'Token tidak tersedia.' });
    }
    const tokenValue = token.split(' ')[1];
    jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Token tidak valid.' });
        }
        return res.status(200).json({ success: true, message: 'Token valid.' });
    });
}
