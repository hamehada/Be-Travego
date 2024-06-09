"use strict";

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Router } = require('express');
const connection = require('../../src/models/connection')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/transport')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =  Math.round(Math.random() * 1e5)
    cb(null, uniqueSuffix + '-' + file.originalname )
  }
})
  
  const upload = multer({storage : storage }).single('gambar_kendaraan');
  
  
  
  const uploadDir = 'uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


exports.addKendaraan = function (req,res) {
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
                      VALUES(?,?,?,?,?,?)`, [tipeKendaraan, noKendaraan, jumlahSeat,namaKendaraan, picture,hargaSewa],
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
  
  exports.getkendaraan = function (req, res)  {
    const {id} = req.params;
    
      const sql = 'SELECT * FROM kendaraan WHERE id_kendaraan = ?';
      db.query(sql, [id], (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(result);
          res.send(result[0]);
        }
      });
    };

 exports.editKendaraan = function (req, res) {
    const id_kendaraan = req.params.id; // Ambil ID kendaraan dari URL
    const {
        tipe_kendaraan,
        no_kendaraan,
        jumlah_seat,
        nama_kendaraan,
        harga_sewa
    } = req.body;

    // Cek apakah ada file yang di-upload, jika ada, update juga gambar_kendaraan
    let picture = req.file ? req.file.filename : null;
    let updateFields = '';

    // Jika ada file di-upload, tambahkan kolom gambar_kendaraan ke daftar field yang akan di-update
    if (picture) {
        updateFields += `gambar_kendaraan = '${picture}', `;
    }

    // Buat query untuk meng-update data kendaraan
    const sqlQuery = `
        UPDATE kendaraan 
        SET ${updateFields}
            tipe_kendaraan = ?,
            no_kendaraan = ?,
            jumlah_seat = ?,
            nama_kendaraan = ?,
            harga_sewa = ?
        WHERE id_kendaraan = ?
    `;

    // Hapus tanda koma terakhir jika ada
    const cleanedSqlQuery = sqlQuery.replace(', WHERE', ' WHERE');

    // Lakukan query ke database
    connection.query(cleanedSqlQuery, [tipe_kendaraan, no_kendaraan, jumlah_seat, nama_kendaraan, harga_sewa, id_kendaraan], (error, rows, fields) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'An error occurred while updating kendaraan.' });
        } else {
            return res.status(200).json({ success: true, message: 'Kendaraan updated successfully.' });
        }
    });
};