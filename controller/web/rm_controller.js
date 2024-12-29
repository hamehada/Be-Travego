"use strict";
const db = require('../../src/models/connection');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/rumahmakan/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});



const upload = multer({ storage: storage }).single('gambar');


// CREATE
exports.addRm = async (req, res) => {

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to upload image.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
        }
        const { nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax } = req.body;
        const gambar = req.file?.path ? req.file?.filename : "/";
        const sql = 'INSERT INTO rumahmakan (nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax, gambar) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax, gambar], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error adding rumahmakan');
                return;
            }
            return res.status(200).send({ success: true, message: 'Rumah makan berhasil ditambahkan' });
        });
    })
};

// READ
exports.getRms = async (req, res) => {
    const sql = 'SELECT * FROM rumahmakan';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        for (const rm of result) {
            rm.gambar = process.env.BASE_URL + "/images/rumahmakan/" + rm.gambar
        }
        res.status(200).send(result);
    });
};

exports.getRm = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM rumahmakan WHERE id_rm = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.status(200).send(result[0]);
    });
}

// UPDATE
exports.editRm = async (req, res) => {

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to upload image.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
        }




        const { id } = req.params;


        const sqlCheck = 'SELECT * FROM rumahmakan WHERE id_rm = ?';
        db.query(sqlCheck, [id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error checking if id_rm exists');
                return;
            }
            if (result.length === 0) {
                return res.status(404).send({ success: false, message: 'Rumah makan not found' });
            }
            const { nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax } = req.body;
            const gambar = req.file?.path ? req.file?.filename : result[0].gambar;
            const sql = 'UPDATE rumahmakan SET nama_rm = ?, harga_pax = ?, menu = ?, alamat = ?, no_tlpn = ?, jumlah_pax = ?, gambar = ? WHERE id_rm = ?';
            db.query(sql, [nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax, gambar, id], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).send('Error updating rumahmakan');
                    return;
                }
                res.status(200).send({ success: true, message: 'Rumah makan berhasil diupdate' });
            });
        });


    })

};

// DELETE
exports.deleteRm = async (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM rumahmakan WHERE id_rm = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error deleting rumahmakan');
            return;
        }
        res.status(200).send({ success: true, message: 'Rumah makan berhasil dihapus' });
    });
};

