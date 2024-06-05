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
        const sql= `
            SELECT pw.*, w.gambar_wisata
            FROM paket_wisata pw
            JOIN wisata w ON pw.id_wisata = w.id_wisata
        `;
    
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
          let hargaSewa = req.body.harga_sewa;
          let lokasiPenjemputan = req.body.lokasi_penjemputan;
          let waktuPenjemputan = req.body.waktu_penjemputan;
          let picture = req.file.path ? req.file.filename : null;
        
      
          connection.query(`INSERT INTO kendaraan(tipe_kendaraan, no_kendaraan, jumlah_seat, nama_kendaraan,gambar_kendaraan,harga_sewa,lokasi_penjemputan,waktu_penjemputan)
                          VALUES(?,?,?,?,?,?,?,?)`, [tipeKendaraan, noKendaraan, jumlahSeat,namaKendaraan, picture,hargaSewa,lokasiPenjemputan,waktuPenjemputan],
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

      const checkIdExists = (tableName, idColumn, id) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT 1 FROM ?? WHERE ?? = ? LIMIT 1`;
            db.query(sql, [tableName, idColumn, id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.length > 0);
            });
        });
    };

    exports.addPesananKendaraan = async (req, res) => {
        const { id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan } = req.body;
    
        try {
            const [pesananExists, kendaraanExists] = await Promise.all([
                checkIdExists('pesanan', 'id_pesanan', id_pesanan),
                checkIdExists('kendaraan', 'id_kendaraan', id_kendaraan)
            ]);
    
            if (!pesananExists) {
                return res.status(400).send('Invalid id_pesanan');
            }
            if (!kendaraanExists) {
                return res.status(400).send('Invalid id_kendaraan');
            }
    
            const sql = 'INSERT INTO pesanan_kendaraan (id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(sql, [id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).send('Error adding pesanan_kendaraan');
                    return;
                }
                res.status(200).send('Pesanan_kendaraan added successfully');
            });
        } catch (err) {
            console.error('Error checking IDs:', err);
            res.status(500).send('Error checking IDs');
        }
    };
    
    exports.addDetailPesananKendaraan = async (req, res) => {
        const { id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan } = req.body;
        const userId = req.user.id; // Ambil ID user dari objek req.user yang diset oleh middleware
    
        // Query untuk mendapatkan id_pesanan berdasarkan user_id
        const getPesananSql = 'SELECT id_pesanan FROM pesanan WHERE id_user = ? ORDER BY tgl_pesanan DESC LIMIT 1';
    
        db.query(getPesananSql, [userId], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Error retrieving pesanan');
            }
    
            if (results.length === 0) {
                return res.status(404).send('No pesanan found for this user');
            }
    
            const id_pesanan = results[0].id_pesanan;
    
            // Buat query untuk memasukkan data ke tabel detail_pesanan_kendaraan
            const insertDetailPesananKendaraanSql = 'INSERT INTO detail_pesanan_kendaraan (id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
            db.query(insertDetailPesananKendaraanSql, [id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).send('Error adding detail pesanan kendaraan');
                }
                res.status(200).send('Detail pesanan kendaraan added successfully');
            });
        });
    };

    // exports.addPesanankendaraan  = async (req, res) => {
    //     const { id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan } = req.body;
    
    //     try {
    //         const [pesananExists, kendaraanExists] = await Promise.all([
    //             checkIdExists('pesanan', 'id_pesanan', id_pesanan),
    //             checkIdExists('kendaraan', 'id_kendaraan', id_kendaraan)
    //         ]);
    
    //         if (!pesananExists) {
    //             return res.status(400).send('Invalid id_pesanan');
    //         }
    //         if (!kendaraanExists) {
    //             return res.status(400).send('Invalid id_kendaraan');
    //         }
    
    //         const sql = 'INSERT INTO pesanan_kendaraan (id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan) VALUES (?, ?, ?, ?, ?, ?, ?)';
    //         db.query(sql, [id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan], (err, result) => {
    //             if (err) {
    //                 console.error('Error executing query:', err);
    //                 res.status(500).send('Error adding pesanan_kendaraan');
    //                 return;
    //             }
    //             res.status(200).send('Pesanan_kendaraan added successfully');
    //         });
    //     } catch (err) {
    //         console.error('Error checking IDs:', err);
    //         res.status(500).send('Error checking IDs');
    //     }
    // };

    

    // exports.addDetailPesananKendaraan = async (req, res) => {
    //     const { id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan } = req.body;
    //     const userId = req.user.id; // Ambil ID user dari objek req.user yang diset oleh middleware
    
    //     // Query untuk mendapatkan id_pesanan berdasarkan user_id
    //     const getPesananSql = 'SELECT id_pesanan FROM pesanan WHERE id_user = ? ORDER BY tgl_pesanan DESC LIMIT 1';
    
    //     db.query(getPesananSql, [userId], (err, results) => {
    //         if (err) {
    //             console.error('Error executing query:', err);
    //             return res.status(500).send('Error retrieving pesanan');
    //         }
    
    //         if (results.length === 0) {
    //             return res.status(404).send('No pesanan found for this user');
    //         }
    
    //         const id_pesanan = results[0].id_pesanan;
    
    //         // Buat query untuk memasukkan data ke tabel detail_pesanan_kendaraan
    //         const insertDetailPesananKendaraanSql = 'INSERT INTO detail_pesanan_kendaraan (id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    //         db.query(insertDetailPesananKendaraanSql, [id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan], (err, result) => {
    //             if (err) {
    //                 console.error('Error executing query:', err);
    //                 return res.status(500).send('Error adding detail pesanan kendaraan');
    //             }
    //             res.status(200).send('Detail pesanan kendaraan added successfully');
    //         });
    //     });
    // };
    
    exports.addDetailPesanan = async (req, res) => {
        const { id_paket_wisata, qty, harga, sub_total } = req.body;
        const userId = req.user.id; // Ambil ID user dari objek req.user yang diset oleh middleware
    
        // Query untuk mendapatkan id_pesanan berdasarkan user_id
        const getPesananSql = 'SELECT id_pesanan FROM pesanan WHERE id_user = ? ORDER BY tgl_pesanan DESC LIMIT 1';
    
        db.query(getPesananSql, [userId], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Error retrieving pesanan');
            }
    
            if (results.length === 0) {
                return res.status(404).send('No pesanan found for this user');
            }
    
            const id_pesanan = results[0].id_pesanan;
    
            // Buat query untuk memasukkan data ke tabel detail_pesanan
            const insertDetailPesananSql = 'INSERT INTO detail_pesanan (id_paket_wisata, qty, harga, sub_total, id_pesanan) VALUES (?, ?, ?, ?, ?)';
    
            db.query(insertDetailPesananSql, [id_paket_wisata, qty, harga, sub_total, id_pesanan], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).send('Error adding detail pesanan');
                }
                res.status(200).send('Detail pesanan added successfully');
            });
        });
    };
