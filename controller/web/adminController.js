"use strict";

const multer = require('multer');
const path = require('path');
const fs = require('fs');
var mysql = require('mysql');
const connection = require('../../src/models/connection')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/transport/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
  
  const upload = multer({storage : storage }).single('gambar_wisata');
  

  
  const uploadDir = 'uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const db = require('../../src/models/connection');
const { Router } = require('express');

exports.loginAdmin = function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Validasi input
  if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password harus diisi.' });
  }

  // Query untuk mendapatkan data admin berdasarkan username
  const sqlQuery = "SELECT * FROM admin WHERE username = ?";
  db.query(sqlQuery, [username], (err, results) => {
      if (err) {
          console.log(err);
          return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login.' });
      }

      if (results.length === 0) {
          return res.status(401).json({ success: false, message: 'Username atau password salah.' });
      }

      const admin = results[0];

      // Verifikasi password
      bcrypt.compare(password, admin.password, (err, isMatch) => {
          if (err) {
              console.log(err);
              return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memverifikasi password.' });
          }

          if (!isMatch) {
              return res.status(401).json({ success: false, message: 'Username atau password salah.' });
          }

          // Buat token JWT
          const token = jwt.sign({ id_admin: admin.id_admin, username: admin.username }, secretKey, { expiresIn: '1h' });

          // Kirim token sebagai respons
          res.status(200).json({ success: true, message: 'Login admin berhasil.', token: token });
      });
  });
};



