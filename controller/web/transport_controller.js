"use strict";

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Router } = require('express');
const connection = require('../../src/models/connection')
const db = require('../../src/models/connection');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/transport/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e5)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage }).single('gambar_kendaraan');



const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


exports.getkendaraan = function (req, res) {
  const { id } = req.params;

  const sql = 'SELECT * FROM kendaraan WHERE id_kendaraan = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (result.length === 0) {
        return res.status(404).send({ success: false, message: 'Kendaraan not found.' });
      }
      for (const r of result) {
        r.gambar_kendaraan = `${BASE_URL}/images/transport/${r.gambar_kendaraan}`
      }
      res.send(result[0]);
    }
  });
};

exports.deleteKendaraan = function (req, res) {
  const { id } = req.params;
  const sql = 'DELETE FROM kendaraan WHERE id_kendaraan = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (result.affectedRows === 0) {
        return res.status(404).send({ success: false, message: 'Kendaraan not found.' });
      }
      res.send({ success: true, message: 'Kendaraan deleted successfully.' });
    }
  });
};

exports.getkendaraans = function (req, res) {
  const sql = 'SELECT * FROM kendaraan ORDER BY id_kendaraan DESC';
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      for (const r of result) {
        r.gambar_kendaraan = `${BASE_URL}/images/transport/${r.gambar_kendaraan}`
      }
      res.send(result);
    }
  });
};


exports.addKendaraan = function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Failed to upload image.' });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }

    let tipeKendaraan = req.body.tipe_kendaraan;
    let noKendaraan = req.body.no_kendaraan;
    let jumlahSeat = req.body.jumlah_seat;
    let namaKendaraan = req.body.nama_kendaraan;
    let hargaSewa = req.body.harga_sewa
    let picture = req.file.path ? req.file.filename : null;


    connection.query(`INSERT INTO kendaraan(tipe_kendaraan, no_kendaraan, jumlah_seat, nama_kendaraan,gambar_kendaraan,harga_sewa)
                      VALUES(?,?,?,?,?,?)`, [tipeKendaraan, noKendaraan, jumlahSeat, namaKendaraan, picture, hargaSewa],
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



exports.editKendaraan = function (req, res) {
  const id_kendaraan = req.params.id;

  // Gunakan middleware multer untuk upload di sini
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Failed to upload image.' });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }

    const {
      tipe_kendaraan,
      no_kendaraan,
      jumlah_seat,
      nama_kendaraan,
      harga_sewa
    } = req.body;

    const checkId = `SELECT * FROM kendaraan WHERE id_kendaraan = ?`;
    connection.query(checkId, [id_kendaraan], (error, rows) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'An error occurred while checking id.' });
      }
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Kendaraan not found.' });
      }

      let updateFields = [];
      if (req.file) {
        updateFields.push(`gambar_kendaraan = ?`);
      }
      updateFields.push(`tipe_kendaraan = ?`, `no_kendaraan = ?`, `jumlah_seat = ?`, `nama_kendaraan = ?`, `harga_sewa = ?`);

      const sqlQuery = `
        UPDATE kendaraan 
        SET ${updateFields.join(', ')}
        WHERE id_kendaraan = ?
      `;

      const queryParams = [];
      if (req.file) {
        queryParams.push(req.file.filename);
      }
      queryParams.push(tipe_kendaraan, no_kendaraan, jumlah_seat, nama_kendaraan, harga_sewa, id_kendaraan);

      // Lakukan query ke database
      connection.query(sqlQuery, queryParams, (error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ success: false, message: 'An error occurred while updating kendaraan.' });
        }
        return res.status(200).json({ success: true, message: 'Kendaraan updated successfully.' });
      });
    });
  });
};