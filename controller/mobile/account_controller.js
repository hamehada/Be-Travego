const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../src/models/connection');
const authMiddleware = require('../../middleware/verifyToken');
const secretKey = ('tr4v3g0')
const mysql = require('mysql2/promise');
require('dotenv').config();


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

    exports.getkendaraan = function (req, res)  {
        
          const sql = 'SELECT * FROM kendaraan';
          db.query(sql, (err, result) => {
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              console.log(result);
              res.send(result);
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
        SELECT * FROM paket_wisata pw 
        INNER JOIN wisata w ON pw.id_wisata = w.id_wisata 
        INNER JOIN rumahmakan rm ON pw.id_rm = rm.id_rm
        INNER JOIN hotel h ON pw.id_hotel = h.id_hotel
        INNER JOIN kendaraan k ON pw.id_kendaraan = k.id_kendaraan
        `;
    
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Error retrieving paket_wisata');
            }
            res.status(200).json(results);
           });
    };
 
    

    exports.datadiri = async (req, res) => {
        const id_user = req.user.id_user; // Ambil ID user dari objek req.user yang diset oleh middleware
        
        const sql = 'SELECT nama, no_hp, email, username FROM user WHERE id_user = ?';
    
        db.query(sql, [id_user], (err, results) => {
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
    exports.viewPesanan = async (req, res) => {
        const sql = `
            SELECT * FROM pesanan p
            INNER JOIN detail_pesanan dp ON p.id_pesanan = dp.id_pesanan
            INNER JOIN paket_wisata pw ON dp.id_paket_wisata = pw.id_paket
            INNER JOIN wisata w ON pw.id_wisata = w.id_wisata
            INNER JOIN rumahmakan rm ON pw.id_rm = rm.id_rm
            INNER JOIN hotel h ON pw.id_hotel = h.id_hotel
            INNER JOIN kendaraan k ON pw.id_kendaraan = k.id_kendaraan
        `;
    
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, message: 'Error retrieving data' });
            }
    
            res.status(200).json({ success: true, data: results });
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

    exports.createPesananWithDetails = async (req, res) => {
        const {
    tgl_pesanan,
    catatan,
    id_paket,
    qty,
    harga,
    sub_total
    } = req.body;
const id_user = req.user.id_user

// Validasi input
if (!tgl_pesanan || !id_paket || !qty || !harga || !sub_total) {
    return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
}

// Cek apakah id_paket_wisata valid
db.query('SELECT id_paket FROM paket_wisata WHERE id_paket = ?', [id_paket], (error, results) => {
    if (error) {
        console.error('Error checking id_paket_wisata:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memproses pesanan.' });
    }

    if (results.length === 0) {
        return res.status(400).json({ success: false, message: 'id_paket_wisata tidak valid.' });
    }

    // Mulai transaksi
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ success: false, message: 'Gagal memulai transaksi.' });
        }

        // SQL query untuk menambahkan pesanan baru
        const sqlInsertPesanan = `
            INSERT INTO pesanan (tgl_pesanan, id_user, catatan, total)
            VALUES (?, ?, ?, 0)`;
        const pesananValues = [tgl_pesanan, id_user, catatan];

        db.query(sqlInsertPesanan, pesananValues, (error, result) => {
            if (error) {
                console.error('Error adding pesanan:', error);
                db.rollback(() => {
                    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memproses pesanan.' });
                });
                return;
            }

            const id_pesanan = result.insertId;

            // Buat query untuk memasukkan data ke tabel detail_pesanan
            const sqlInsertDetailPesanan = `
                INSERT INTO detail_pesanan (id_paket_wisata, qty, harga, sub_total, id_pesanan)
                VALUES (?, ?, ?, ?, ?)`;
            const detailValues = [id_paket, qty, harga, sub_total, id_pesanan];

            db.query(sqlInsertDetailPesanan, detailValues, (error) => {
                if (error) {
                    console.error('Error adding detail pesanan:', error);
                    db.rollback(() => {
                        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memproses pesanan.' });
                    });
                    return;
                }

                // Update kolom total di tabel pesanan
                const sqlUpdateTotal = `UPDATE pesanan SET total = ? WHERE id_pesanan = ?`;
                db.query(sqlUpdateTotal, [sub_total, id_pesanan], (error) => {
                    if (error) {
                        console.error('Error updating pesanan total:', error);
                        db.rollback(() => {
                            res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memproses pesanan.' });
                        });
                        return;
                    }

                    // Commit transaksi
                    db.commit((error) => {
                        if (error) {
                            console.error('Error committing transaction:', error);
                            db.rollback(() => {
                                res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi.' });
                            });
                            return;
                        }

                        res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat.', id_pesanan });
                    });
                });
            });
        });
    });
});
};
exports.createPesananWithDetailsKendaraan = async(req, res) => {
    const {
        tgl_pesanan,
        catatan,
        id_kendaraan,
        qty,
        harga,
        subtotal,
        lokasi_penjemputan,
        waktu_penjemputan
    } = req.body;
    const id_user = req.user.id_user; // Mengambil id_user dari user yang sedang login

    // Validasi input
    if (!tgl_pesanan || !id_kendaraan || !qty || !harga || !subtotal || !lokasi_penjemputan || !waktu_penjemputan) {
        return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    // Mulai transaksi
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ success: false, message: 'Gagal memulai transaksi.' });
        }

        // SQL query untuk menambahkan pesanan baru
        const sqlInsertPesanan = `
            INSERT INTO pesanan (tgl_pesanan, id_user, catatan, total)
            VALUES (?, ?, ?, 0)`;
        const pesananValues = [tgl_pesanan, id_user, catatan];

        db.query(sqlInsertPesanan, pesananValues, (error, result) => {
            if (error) {
                console.error('Error adding pesanan:', error);
                return db.rollback(() => {
                    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat membuat pesanan.' });
                });
            }

            const id_pesanan = result.insertId;

            // Buat query untuk memasukkan data ke tabel detail_pesanan_kendaraan
            const sqlInsertDetailPesanan = `
                INSERT INTO detail_pesanan_kendaraan (id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const detailValues = [id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan];

            db.query(sqlInsertDetailPesanan, detailValues, (error) => {
                if (error) {
                    console.error('Error adding detail pesanan:', error);
                    return db.rollback(() => {
                        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menambahkan detail pesanan.' });
                    });
                }

                // Update kolom total di tabel pesanan
                const sqlUpdateTotal = `UPDATE pesanan SET total = ? WHERE id_pesanan = ?`;
                db.query(sqlUpdateTotal, [subtotal, id_pesanan], (error) => {
                    if (error) {
                        console.error('Error updating pesanan total:', error);
                        return db.rollback(() => {
                            res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memperbarui total pesanan.' });
                        });
                    }

                    // Commit transaksi
                    db.commit((error) => {
                        if (error) {
                            console.error('Error committing transaction:', error);
                            return db.rollback(() => {
                                res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi.' });
                            });
                        }

                        res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat.', id_pesanan });
                    });
                });
            });
        });
    });
};   
