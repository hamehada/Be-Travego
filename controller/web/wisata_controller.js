"use strict";

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connection = require('../../src/models/connection')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/wisata/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});



const upload = multer({ storage: storage }).single('gambar_wisata');



const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const db = require('../../src/models/connection');
const { BASE_URL } = require('../../constant');

const checkIdExists = (table, column, id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) as count FROM ?? WHERE ?? = ?`;
        db.query(sql, [table, column, id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].count > 0);
            }
        });
    });
};

exports.addPaketwisata = async (req, res) => {
    const { nama_paket, deskripsi, id_rm, id_hotel, id_kendaraan, harga, id_wisata } = req.body;

    try {
        const [rmExists, hotelExists, kendaraanExists, wisataExists] = await Promise.all([
            checkIdExists('rumahmakan', 'id_rm', id_rm),
            checkIdExists('hotel', 'id_hotel', id_hotel),
            checkIdExists('kendaraan', 'id_kendaraan', id_kendaraan),
            checkIdExists('wisata', 'id_wisata', id_wisata)
        ]);

        if (!rmExists) {
            return res.send({ success: false, message: 'ID Rumah Makan tidak valid' });
        }
        if (!hotelExists) {
            return res.send({ success: false, message: 'ID Hotel tidak valid' });
        }
        if (!kendaraanExists) {
            return res.send({ success: false, message: 'ID Kendaraan tidak valid' });
        }
        if (!wisataExists) {
            return res.send({ success: false, message: 'ID Wisata tidak valid' });
        }

        const sql = 'INSERT INTO paket_wisata (nama_paket, deskripsi, id_rm, id_hotel, id_kendaraan, harga, id_wisata) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [nama_paket, deskripsi, id_rm, id_hotel, id_kendaraan, harga, id_wisata], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error adding paket_wisata');
                return;
            }
            res.status(200).send({ success: true, message: 'Paket wisata berhasil ditambahkan' });
        });
    } catch (err) {
        console.error('Error checking IDs:', err);
        res.status(500).send('Error checking IDs');
    }
};


exports.addWisata = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to upload image.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
        }

        let namaWisata = req.body.nama_wisata;
        let Lokasi = req.body.lokasi;
        let hargaTiket = req.body.harga_tiket;
        let picture = req.file.path ? req.file.filename : null;

        connection.query(`INSERT INTO wisata(nama_wisata, lokasi, harga_tiket,gambar_wisata)
                    VALUES(?,?,?,?)`, [namaWisata, Lokasi, hargaTiket, picture],
            function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ success: false, message: 'An error occurred while adding menu.' });
                } else {
                    return res.status(200).json({ success: true, message: 'Menu added successfully.' });
                }
            }
        );
    });
};

exports.getWisata = function (req, res) {
    const { id } = req.params;
    const sql = 'SELECT * FROM wisata WHERE id_wisata = ?'
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length === 0) {
            return res.status(404).send({ success: false, message: 'Wisata not found.' });
        }
        for (const r of result) {
            r.gambar_wisata = `${BASE_URL}/images/wisata/${r.gambar_wisata}`
        }
        res.send(result[0]);
    });
};

exports.getWisatas = function (req, res) {
    const sql = 'SELECT * FROM wisata ORDER BY id_wisata DESC'
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        for (const r of result) {
            r.gambar_wisata = `${BASE_URL}/images/wisata/${r.gambar_wisata}`
        }
        res.send(result);
    });
};



exports.getPaketWisatas = function (req, res) {
    const sql = `
        SELECT pw.*, w.nama_wisata, w.gambar_wisata, rm.nama_rm, h.nama_hotel, k.nama_kendaraan
        FROM paket_wisata pw
        INNER JOIN wisata w ON pw.id_wisata = w.id_wisata
        INNER JOIN rumahmakan rm ON pw.id_rm = rm.id_rm
        INNER JOIN hotel h ON pw.id_hotel = h.id_hotel
        INNER JOIN kendaraan k ON pw.id_kendaraan = k.id_kendaraan
        ORDER BY pw.id_paket DESC
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data paket wisata.' });
        }
        const data = result.map(r => ({
            id_paket: r.id_paket,
            nama_paket: r.nama_paket,
            deskripsi: r.deskripsi,
            harga: r.harga,
            id_wisata: r.id_wisata,
            id_rm: r.id_rm,
            id_hotel: r.id_hotel,
            id_kendaraan: r.id_kendaraan,
            gambar_paket: r.gambar_paket ? `${BASE_URL}/images/wisata/${r.gambar_paket}` : null,
            wisata: {
                id_wisata: r.id_wisata,
                nama_wisata: r.nama_wisata,
                gambar_wisata: r.gambar_wisata ? `${BASE_URL}/images/wisata/${r.gambar_wisata}` : null
            },
            rumahmakan: {
                id_rm: r.id_rm,
                nama_rm: r.nama_rm
            },
            hotel: {
                id_hotel: r.id_hotel,
                nama_hotel: r.nama_hotel
            },
            kendaraan: {
                id_kendaraan: r.id_kendaraan,
                nama_kendaraan: r.nama_kendaraan
            }
        }));
        return res.send(data);
    });
};


exports.getPaketWisata = function (req, res) {
    const { id } = req.params;
    const sql = `
        SELECT pw.*, w.nama_wisata, w.gambar_wisata, rm.nama_rm, h.nama_hotel, k.nama_kendaraan
        FROM paket_wisata pw
        INNER JOIN wisata w ON pw.id_wisata = w.id_wisata
        INNER JOIN rumahmakan rm ON pw.id_rm = rm.id_rm
        INNER JOIN hotel h ON pw.id_hotel = h.id_hotel
        INNER JOIN kendaraan k ON pw.id_kendaraan = k.id_kendaraan
        WHERE pw.id_paket = ?
    `;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data paket wisata.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Data paket wisata tidak ditemukan.' });
        }
        const data = result.map(r => ({
            id_paket: r.id_paket,
            nama_paket: r.nama_paket,
            deskripsi: r.deskripsi,
            harga: r.harga,
            id_wisata: r.id_wisata,
            id_rm: r.id_rm,
            id_hotel: r.id_hotel,
            id_kendaraan: r.id_kendaraan,
            gambar_paket: r.gambar_paket ? `${BASE_URL}/images/wisata/${r.gambar_paket}` : null,
            wisata: {
                id_wisata: r.id_wisata,
                nama_wisata: r.nama_wisata,
                gambar_wisata: r.gambar_wisata ? `${BASE_URL}/images/wisata/${r.gambar_wisata}` : null
            },
            rumahmakan: {
                id_rm: r.id_rm,
                nama_rm: r.nama_rm
            },
            hotel: {
                id_hotel: r.id_hotel,
                nama_hotel: r.nama_hotel
            },
            kendaraan: {
                id_kendaraan: r.id_kendaraan,
                nama_kendaraan: r.nama_kendaraan
            }
        }));
        return res.send(data[0]);
    });
};

