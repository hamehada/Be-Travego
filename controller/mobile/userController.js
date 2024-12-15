"use strict";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../src/models/connection');
const path = require('path');
const secretKey = ('tr4v3g0');
const dotenv = require('dotenv');

dotenv.config();
// const verifikasi = require("./middleware/verifikasi");

exports.getUser = function (req, res) {
    const idUser = req.id_user;
    const sqlQuery = "SELECT * FROM user ";

    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
            console.log(result)
        }
    });
}

// Pastikan ini mengarah ke modul koneksi database Anda

// Ganti dengan kunci rahasia Anda

exports.register = function (req, res) {
    const userName = req.body.username;
    const Nama = req.body.nama;
    const noHp = req.body.no_hp;
    const Password = req.body.password;
    const Email = req.body.email;

    // Validasi input
    if (!userName || !Nama || !noHp || !Password || !Email) {
        return res.status(400).json({ success: false, message: 'Semua field harus diisi.' });
    }

    // Hash kata sandi
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat meng-hash kata sandi.' });
        }

        // SQL query untuk menyimpan pengguna baru
        const sqlQuery = "INSERT INTO user (username, nama, no_hp, password, email) VALUES (?, ?, ?, ?, ?)";
        db.query(sqlQuery, [userName, Nama, noHp, hashedPassword, Email], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mendaftarkan pengguna.' });
            }

            // Buat token JWT
            const token = jwt.sign({ id: result.insertId, username: userName, email: Email }, secretKey, { expiresIn: '1h' });

            // Kirim token sebagai respons
            res.status(201).json({ success: true, message: 'Pengguna berhasil didaftarkan.' });
        });
    });
};

exports.login = function (req, res) {
    const userName = req.body.username;
    const Password = req.body.password;

    // Validasi input
    if (!userName || !Password) {
        return res.status(400).json({ success: false, message: 'Username dan password harus diisi.' });
    }

    // SQL query untuk mendapatkan pengguna berdasarkan username
    const sqlQuery = "SELECT * FROM user WHERE username = ?";
    db.query(sqlQuery, [userName], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Username atau password salah.' });
        }

        const user = results[0];

        // Verifikasi password
        bcrypt.compare(Password, user.password, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memverifikasi password.' });
            }

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Username atau password salah.' });
            }

            // Buat token JWT
            const token = jwt.sign({ id_user: user.id_user }, secretKey, { expiresIn: '1h' });

            // Kirim token sebagai respons
            res.status(200).json({ success: true, message: 'Login berhasil.', token: token });
        });
    });
};

exports.editUser = function(req, res) {
    const id_user = req.user.id_user;
    const { nama, no_hp, email, username } = req.body;

    const sql = ' UPDATE user SET nama = ?, no_hp = ?, email = ?, username = ? WHERE id_user =?';

    db.query(sql, [nama, no_hp, email, username, id_user], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
            console.log(result);
        }
    });
};

exports.getImageWisata = (req, res) => {
    try {
        const { name } = req.params;
        const filePath = path.join(__dirname, `../../images/wisata/${name}`);
        res.sendFile(filePath);
    } catch (error) {
        console.log(error)
    }
}

exports.getImageTransport = (req, res) => {
    try {
        const { name } = req.params;
        const filePath = path.join(__dirname, `../../images/transport/${name}`);
        res.sendFile(filePath);
    } catch (error) {
        console.log(error)
    }
}

exports.getImageRumahmakan = (req, res) => {
    try {
        const { name } = req.params;
        const filePath = path.join(__dirname, `../../images/rumahmakan/${name}`);
        res.sendFile(filePath);
    } catch (error) {
        console.log(error)
    }
}