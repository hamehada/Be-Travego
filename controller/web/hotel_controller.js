"use strict";

const multer = require('multer');
const path = require('path');
const fs = require('fs');
var mysql = require('mysql');

const connection = require('../../src/models/connection')
const { BASE_URL } = require('../../constant/index')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/hotel/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Math.round(Math.random() * 1e5)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage }).single('gambar_hotel');

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const db = require('../../src/models/connection');
const { Router } = require('express');

exports.getHotels = function (req, res) {
    const sql = 'SELECT * FROM hotel ORDER BY id_hotel DESC';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        for (const r of result) {
            r.gambar_hotel = `${BASE_URL}/images/hotel/${r.gambar_hotel}`
        }
        return res.send(result);
    });
};

exports.getHotel = function (req, res) {
    const { id } = req.params;

    const sql = 'SELECT * FROM hotel WHERE id_hotel = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        for (const r of result) {
            r.gambar_hotel = `${BASE_URL}/images/hotel/${r.gambar_hotel}`
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Hotel tidak ditemukan.' });
        }
        return res.send(result[0]);
    });
};

exports.deleteHotel = function (req, res) {
    const { id } = req.params;
    const sql = 'DELETE FROM hotel WHERE id_hotel = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Hotel tidak ditemukan.' });
        }
        return res.send({ success: true, message: 'Hotel berhasil dihapus.' });
    });
}

exports.addHotel = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Gagal mengunggah gambar.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan yang tidak terduga.' });
        }

        // Ekstraksi data dari body permintaan
        const namaHotel = req.body.nama_hotel;
        const hargaKamar = req.body.harga_kamar;
        const alamatHotel = req.body.alamat_hotel;
        const tlpnHotel = req.body.phone_hotel;
        const jumlahKamar = req.body.jumlah_kamar;
        const picture = req.file ? req.file.filename : null;

        // Pastikan semua field yang diperlukan disediakan
        if (!namaHotel || !hargaKamar || !alamatHotel || !tlpnHotel || !jumlahKamar) {
            return res.status(400).json({ success: false, message: 'Semua field harus diisi.' });
        }

        // Query SQL untuk memasukkan data hotel
        const query = `
            INSERT INTO hotel (nama_hotel, harga_kamar, alamat_hotel, phone_hotel, jumlah_kamar, gambar_hotel)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Eksekusi query
        connection.query(query, [namaHotel, hargaKamar, alamatHotel, tlpnHotel, jumlahKamar, picture], function (error, results) {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menambahkan hotel.' });
            } else {
                return res.status(200).json({ success: true, message: 'Hotel berhasil ditambahkan.' });
            }
        });
    });
};

exports.editHotel = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Gagal mengunggah gambar.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan yang tidak terduga.' });
        }

        // Ekstraksi data dari body permintaan
        const hotelId = req.params.id; // Pastikan Anda mengirimkan ID hotel yang akan diedit
        const namaHotel = req.body.nama_hotel;
        const hargaKamar = req.body.harga_kamar;
        const alamatHotel = req.body.alamat_hotel;
        const tlpnHotel = req.body.phone_hotel;
        const jumlahKamar = req.body.jumlah_kamar;
        const picture = req.file ? req.file.filename : null;

        // Pastikan ID hotel disediakan
        if (!hotelId) {
            return res.status(400).json({ success: false, message: 'ID hotel harus disediakan.' });
        }

        // Buat array untuk menyimpan query dan nilai parameter
        let query = `UPDATE hotel SET `;
        let values = [];

        // Tambahkan field yang ingin diupdate ke query dan values
        if (namaHotel) {
            query += `nama_hotel = ?, `;
            values.push(namaHotel);
        }
        if (hargaKamar) {
            query += `harga_kamar = ?, `;
            values.push(hargaKamar);
        }
        if (alamatHotel) {
            query += `alamat_hotel = ?, `;
            values.push(alamatHotel);
        }
        if (tlpnHotel) {
            query += `phone_hotel = ?, `;
            values.push(tlpnHotel);
        }
        if (jumlahKamar) {
            query += `jumlah_kamar = ?, `;
            values.push(jumlahKamar);
        }
        if (picture) {
            query += `gambar_hotel = ?, `;
            values.push(picture);
        }

        // Hilangkan koma terakhir dan tambahkan kondisi WHERE
        query = query.slice(0, -2) + ` WHERE id_hotel = ?`;
        values.push(hotelId);

        // Eksekusi query
        connection.query(query, values, function (error, results) {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengedit hotel.' });
            } else {
                return res.status(200).json({ success: true, message: 'Hotel berhasil diedit.' });
            }
        });
    });
};