"use strict";

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connection = require('../../src/models/connection')



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images_wisata')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname )
}
});


  
  const upload = multer({storage : storage }).single('gambar_wisata');
  

  
  const uploadDir = 'uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const db = require('../../src/models/connection');
const { Router } = require('express');

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
          return res.status(400).send('Invalid id_rm');
      }
      if (!hotelExists) {
          return res.status(400).send('Invalid id_hotel');
      }
      if (!kendaraanExists) {
          return res.status(400).send('Invalid id_kendaraan');
      }
      if (!wisataExists) {
          return res.status(400).send('Invalid id_wisata');
      }

      const sql = 'INSERT INTO paket_wisata (nama_paket, deskripsi, id_rm, id_hotel, id_kendaraan, harga, id_wisata) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(sql, [nama_paket, deskripsi, id_rm, id_hotel, id_kendaraan, harga, id_wisata], (err, result) => {
          if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Error adding paket_wisata');
              return;
          }
          res.status(200).send('Paket_wisata added successfully');
      });
  } catch (err) {
      console.error('Error checking IDs:', err);
      res.status(500).send('Error checking IDs');
  }
};


exports.addWisata = function (req,res) {
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
                    VALUES(?,?,?,?)`, [namaWisata,Lokasi,hargaTiket,picture],
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

    const {id} = req.params;
    const sql = 'SELECT * FROM wisata id_wisata = ?'
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(err);
      }
      res.send(result[0]);
    });
  };

