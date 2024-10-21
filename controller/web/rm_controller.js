"use strict";
const db = require('../../src/models/connection');

// CREATE
exports.addRm = async (req, res) => {
    const { nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax } = req.body;    

    const sql = 'INSERT INTO rumahmakan (nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error adding rumahmakan');
            return;
        }
        res.status(200).send({ success: true, message: 'Rumah makan berhasil ditambahkan' });
    });
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
    const { id } = req.params;
    const { nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax } = req.body;

    const sql = 'UPDATE rumahmakan SET nama_rm = ?, harga_pax = ?, menu = ?, alamat = ?, no_tlpn = ?, jumlah_pax = ? WHERE id_rm = ?';
    db.query(sql, [nama_rm, harga_pax, menu, alamat, no_tlpn, jumlah_pax, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error updating rumahmakan');
            return;
        }
        res.status(200).send({ success: true, message: 'Rumah makan berhasil diupdate' });
    });
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

