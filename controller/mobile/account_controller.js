const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../src/models/connection');
const authMiddleware = require('../../middleware/authMiddelware');
const secretKey = ('tr4v3g0')

exports.getWisata = function (req, res) {

    const sqlQuery = "SELECT * FROM wisata";
    db.query(sqlQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data hotel.' });
        }
        res.status(200).json({ success: true, hotels: results });
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

exports.getHotel = function (req, res)  {
  const {id} = req.params;
  
    const sql = 'SELECT * FROM hotel WHERE id_hotel = ?';
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

      exports.getPaketwisata = (req, res) => {
        const sql = 'SELECT * FROM paket_wisata';
        
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Error retrieving paket_wisata');
            }
    
            res.status(200).json(results);
        });
    };

    exports.datadiri = (req, res) => {
        const userId = req.user.id; // Ambil ID user dari objek req.user yang diset oleh middleware
    
        const sql = 'SELECT nama, no_hp, email FROM user WHERE id_user = ?';
        
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Error retrieving user details');
            }
    
            if (results.length === 0) {
                return res.status(404).send('User not found');
            }
    
            res.status(200).json(results[0]);
        });
    };
