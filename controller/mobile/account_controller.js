const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../src/models/connection');
const authMiddleware = require('../../middleware/verifyToken');
const secretKey = ('tr4v3g0')
const mysql = require('mysql2/promise');
const { midtransCheckout, midtransBulkCheck, midtransCheck } = require('./midtrans');
require('dotenv').config();


exports.getWisata = function (req, res) {

    const sqlQuery = "SELECT * FROM wisata";
    db.query(sqlQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data hotel.' });
        }
        res.status(200).json(results);
    });
};

exports.getkendaraan = function (req, res) {
    const sql = 'SELECT * FROM kendaraan';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
};

exports.getrumahmakan = function (req, res) {
    const sql = 'SELECT * FROM rumahmakan';
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

exports.getHotel = function (req, res) {
    const { id } = req.params;

    const sql = 'SELECT * FROM hotel WHERE id_hotel = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result[0]);
        }
    });
};

exports.getPaketwisata = (req, res) => {
    const sql = `
    SELECT * FROM paket_wisata pw
    INNER JOIN wisata w ON pw.id_wisata = w.id_wisata
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

    const sql = 'SELECT * FROM user WHERE id_user = ?';

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
        let hargaSewa = req.body.harga_sewa;
        let lokasiPenjemputan = req.body.lokasi_penjemputan;
        let waktuPenjemputan = req.body.waktu_penjemputan;
        let picture = req.file.path ? req.file.filename : null;


        connection.query(`INSERT INTO kendaraan(tipe_kendaraan, no_kendaraan, jumlah_seat, nama_kendaraan,gambar_kendaraan,harga_sewa,lokasi_penjemputan,waktu_penjemputan)
                          VALUES(?,?,?,?,?,?,?,?)`, [tipeKendaraan, noKendaraan, jumlahSeat, namaKendaraan, picture, hargaSewa, lokasiPenjemputan, waktuPenjemputan],
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
// exports.viewPesanan = async (req, res) => {
//     const { id_user } = req.user; // Ambil ID user dari objek req.user yang diset oleh middleware
//     console.log({ id_user });
//     const sql = `
//             SELECT * FROM pesanan p
//             INNER JOIN detail_pesanan dp ON p.id_pesanan = dp.id_pesanan
//             INNER JOIN paket_wisata pw ON dp.id_paket_wisata = pw.id_paket
//             INNER JOIN wisata w ON pw.id_wisata = w.id_wisata
//             INNER JOIN user u ON p.id_user = u.id_user
//             WHERE p.id_user = ?            
//         `;

//     db.query(sql, [id_user], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);            
//             return res.status(500).json({ success: false, message: 'Error retrieving data' });
//         }
//         console.log(results);
//         res.status(200).json({ success: true, data: results });
//     });
// };

// FUFUFAFA
exports.viewPesanan = async (req, res) => {
    let user = null;
    let historyPakets = [];
    let historyKendaraans = [];
    let expiredIdPesanans = [];
    let midtransIds = [];

    const { id_user } = req.user;

    const queryUser = "SELECT * FROM user WHERE id_user = ?";

    db.query(queryUser, [id_user], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error retrieving user' });
        }
        user = results[0];

        const queryHistoryPakets = "SELECT dp.qty, dp.harga, dp.id_pesanan, p.tgl_pesanan, p.catatan, p.total, pw.nama_paket, p.status, p.redirect_url, p.snap_token, p.midtrans_id FROM detail_pesanan dp INNER JOIN pesanan p ON dp.id_pesanan = p.id_pesanan INNER JOIN paket_wisata pw ON dp.id_paket_wisata = pw.id_paket WHERE p.id_user = ?";

        db.query(queryHistoryPakets, [id_user], (err, resPakets) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, message: 'Error retrieving history pakets' });
            }
            historyPakets = resPakets;


            const queryHistoryKendaraans = "SELECT dp.qty, dp.harga, dp.id_pesanan, p.tgl_pesanan, p.catatan, p.total, k.nama_kendaraan, k.no_kendaraan, p.status, p.redirect_url, p.snap_token, p.midtrans_id FROM detail_pesanan_kendaraan dp INNER JOIN pesanan p ON dp.id_pesanan = p.id_pesanan INNER JOIN kendaraan k ON dp.id_kendaraan = k.id_kendaraan WHERE p.id_user = ?";

            db.query(queryHistoryKendaraans, [id_user], async (err, resKendaraans) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ success: false, message: 'Error retrieving history kendaraans' });
                }
                historyKendaraans = resKendaraans;

                const oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDate() - 1);

                const getOneDayAgo = (params) => {
                    const date = new Date(params);
                    date.setDate(date.getDate() - 1);
                    return date;
                }

                const getOneDayAfter = (params) => {
                    const date = new Date(params);
                    date.setDate(date.getDate() + 1);
                    return date;
                }

                for (const item of historyPakets) {
                    // console.log(getOneDayAfter(item.tgl_pesanan), ">", new Date())
                    if (item.status === "Menunggu Pembayaran" && getOneDayAfter(item.tgl_pesanan) < new Date()) {
                        expiredIdPesanans.push(item.id_pesanan);
                    }
                    if (item?.midtrans_id && item.status === "Menunggu Pembayaran" && getOneDayAfter(item.tgl_pesanan) > new Date()) {
                        midtransIds.push(item.midtrans_id);
                    }
                }

                for (const item of historyKendaraans) {
                    if (item.status === "Menunggu Pembayaran" && getOneDayAfter(item.tgl_pesanan) < new Date()) {
                        expiredIdPesanans.push(item.id_pesanan);
                    }
                    if (item?.midtrans_id && item.status === "Menunggu Pembayaran" && getOneDayAfter(item.tgl_pesanan) > new Date()) {
                        midtransIds.push(item.midtrans_id);
                    }
                }

                for (const midtransId of midtransIds) {
                    const check = await midtransCheck(midtransId);
                    if (check !== false) {
                        const { transaction_status, status_code, settlement_time } = check
                        if (status_code && transaction_status && settlement_time && status_code === '200' && transaction_status === 'settlement') {
                            console.log("hitted")
                            const updatePesananQuery = "UPDATE pesanan SET status = 'Lunas' WHERE midtrans_id = ?";
                            db.query(updatePesananQuery, [midtransId], (err, results) => {
                                if (err) {
                                    console.error('Error executing query:', err);
                                    return res.status(500).json({ success: false, message: 'Error updating pesanan' });
                                }
                            });

                        }
                    }
                }


                const queryUpdateExpiredPesanans = expiredIdPesanans.length > 0 ? "UPDATE pesanan SET status = 'Kadaluarsa' WHERE id_pesanan IN (?)" : "SELECT 1";

                db.query(queryUpdateExpiredPesanans, [expiredIdPesanans], (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return res.status(500).json({ success: false, message: 'Error updating expired pesanans' });
                    }

                    db.query(queryHistoryPakets, [id_user], (err, resPakets) => {
                        if (err) {
                            console.error('Error executing query:', err);
                            return res.status(500).json({ success: false, message: 'Error retrieving history pakets' });
                        }
                        historyPakets = resPakets;

                        db.query(queryHistoryKendaraans, [id_user], (err, resKendaraans) => {
                            if (err) {
                                console.error('Error executing query:', err);
                                return res.status(500).json({ success: false, message: 'Error retrieving history kendaraans' });
                            }

                            historyKendaraans = resKendaraans;

                            const formattedHistoryKendaraan = historyKendaraans.map((item) => ({
                                id_pesanan: item.id_pesanan,
                                tgl_pesanan: item.tgl_pesanan,
                                catatan: item.catatan,
                                total: item.total,
                                qty: item.qty,
                                harga: item.harga,
                                nama_paket: `${item.nama_kendaraan} (${item.no_kendaraan})`,
                                email: user.email,
                                no_hp: user.no_hp,
                                nama: user.nama,
                                status: item.status,
                                redirect_url: item.redirect_url,
                                snap_token: item.snap_token,
                                midtrans_id: item.midtrans_id
                            }))

                            const formattedHistoryPakets = historyPakets.map((item) => ({
                                id_pesanan: item.id_pesanan,
                                tgl_pesanan: item.tgl_pesanan,
                                catatan: item.catatan,
                                total: item.total,
                                qty: item.qty,
                                harga: item.harga,
                                nama_paket: item.nama_paket,
                                email: user.email,
                                no_hp: user.no_hp,
                                nama: user.nama,
                                status: item.status,
                                redirect_url: item.redirect_url,
                                snap_token: item.snap_token,
                                midtrans_id: item.midtrans_id
                            }))

                            const merged = [...formattedHistoryKendaraan, ...formattedHistoryPakets].sort((a, b) => new Date(b.tgl_pesanan) - new Date(a.tgl_pesanan));


                            res.status(200).json({ success: true, data: merged });
                        })

                    })
                })
            })
        })
    })
};

// FUFUFAFA
exports.viewPesananById = async (req, res) => {
    const { id } = req.params;
    const queryPesanan = "SELECT midtrans_id, redirect_url, snap_token, id_pesanan, tgl_pesanan, catatan, total, status FROM pesanan WHERE id_pesanan = ?";

    db.query(queryPesanan, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error retrieving pesanan' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Pesanan not found' });
        } else {

            if (results[0].midtrans_id) {
                console.log(results[0].midtrans_id);
                // zuzuzu
                const check = midtransCheck(results[0].midtrans_id);
                console.log(check);
            }

            res.status(200).json({ success: true, data: results[0] });
        }
    })
};


exports.addPesanankendaraan = async (req, res) => {
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


// FUFUFAFA
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
                        db.commit(async (error) => {
                            if (error) {
                                console.error('Error committing transaction:', error);
                                db.rollback(() => {
                                    res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi.' });
                                });
                                return;
                            }

                            const midTransId = `${id_pesanan}-${Math.floor(Math.random() * 1000)}`

                            const pay = await midtransCheckout(midTransId, sub_total);
                            if (pay instanceof Error) {
                                db.rollback(() => {
                                    res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi.' });
                                });
                            }

                            const queryUpdateMidtrans = `UPDATE pesanan SET midtrans_id = ?, snap_token = ?, redirect_url = ? WHERE id_pesanan = ?`;
                            const valuesUpdateMidtrans = [midTransId, pay.token, pay.redirect_url, id_pesanan];

                            db.query(queryUpdateMidtrans, valuesUpdateMidtrans, (error) => {
                                if (error) {
                                    console.error('Error updating midtrans:', error);
                                    db.rollback(() => {
                                        res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi.' });
                                    });
                                    return;
                                }
                                res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat.', token: pay.token, redirect_url: pay.redirect_url });
                            }
                            )
                        });
                    });
                });
            });
        });
    });
};


// FUFUFAFA
exports.createPesananWithDetailsKendaraan = async (req, res) => {
    const {
        tgl_pesanan,
        id_kendaraan,
        lokasi_penjemputan,
        waktu_penjemputan
    } = req.body;
    const id_user = req.user.id_user; // Mengambil id_user dari user yang sedang login

    // Validasi input
    if (!tgl_pesanan || !id_kendaraan || !lokasi_penjemputan || !waktu_penjemputan) {
        return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    let harga = 0;
    // Cek apakah id_kendaraan valid
    db.query('SELECT id_kendaraan, harga_sewa FROM kendaraan WHERE id_kendaraan = ?', [id_kendaraan], (error, results) => {
        if (error) {
            console.error('Error checking id_kendaraan:', error);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memproses pesanan.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'id_kendaraan tidak valid.' });
        } else {
            harga = results[0].harga_sewa
        }
    });

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
        const pesananValues = [tgl_pesanan, id_user, "", harga];

        db.query(sqlInsertPesanan, pesananValues, (error, result) => {
            if (error) {
                console.error('Error adding pesanan:', error);
                return db.rollback(() => {
                    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat membuat pesanan.' });
                });
            }

            const id_pesanan = result.insertId;
            const qty = 1;
            // Buat query untuk memasukkan data ke tabel detail_pesanan_kendaraan
            const sqlInsertDetailPesanan = `
                INSERT INTO detail_pesanan_kendaraan (id_pesanan, id_kendaraan, qty, harga, subtotal, lokasi_penjemputan, waktu_penjemputan)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const detailValues = [id_pesanan, id_kendaraan, qty, harga, harga * qty, lokasi_penjemputan, waktu_penjemputan];

            db.query(sqlInsertDetailPesanan, detailValues, (error) => {
                if (error) {
                    console.error('Error adding detail pesanan:', error);
                    return db.rollback(() => {
                        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menambahkan detail pesanan.' });
                    });
                }

                // Update kolom total di tabel pesanan
                const sqlUpdateTotal = `UPDATE pesanan SET total = ? WHERE id_pesanan = ?`;
                db.query(sqlUpdateTotal, [harga * qty, id_pesanan], (error) => {
                    if (error) {
                        console.error('Error updating pesanan total:', error);
                        return db.rollback(() => {
                            res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memperbarui total pesanan.' });
                        });
                    }

                    // Commit transaksi
                    db.commit(async (error) => {
                        if (error) {
                            console.error('Error committing transaction:', error);
                            return db.rollback(() => {
                                res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi.' });
                            });
                        }

                        const midTransId = `${id_pesanan}-${Math.floor(Math.random() * 1000)}`

                        const pay = await midtransCheckout(midTransId, harga * qty);
                        if (pay instanceof Error) {
                            db.rollback(() => {
                                res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi.' });
                            });
                        }

                        const queryUpdateMidtrans = `UPDATE pesanan SET midtrans_id = ?, snap_token = ?, redirect_url = ? WHERE id_pesanan = ?`;
                        const valuesUpdateMidtrans = [midTransId, pay.token, pay.redirect_url, id_pesanan];

                        db.query(queryUpdateMidtrans, valuesUpdateMidtrans, (error) => {
                            if (error) {
                                console.error('Error updating midtrans_id:', error);
                                return db.rollback(() => {
                                    res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi.' });
                                });
                            }
                            res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat.', token: pay.token, redirect_url: pay.redirect_url });
                        });
                    });
                });
            });
        });
    });
};

exports.addReservasiRm = async (req, res) => {
    const { id_rm, waktu_reservasi, jumlah_pax } = req.body;
    const id_user = req.user.id_user; // Corrected to use id_user

    console.log('req.user:', req.user); // Debugging, should log { id_user: 20, ... }
    console.log('id_user:', id_user);   // Should now correctly log 20

    if (!id_user) {
        return res.status(400).send('User not authenticated or id_user is null');
    }

    try {
        // Check if id_rm exists in the rumahmakan table
        const rmExists = await checkIdExists('rumahmakan', 'id_rm', id_rm);

        if (!rmExists) {
            return res.status(400).send('Invalid id_rm');
        }

        const sql = 'INSERT INTO reservasi_rm (id_rm, id_user, waktu_reservasi, jumlah_pax, created_at) VALUES (?, ?, ?, ?, NOW())';
        db.query(sql, [id_rm, id_user, waktu_reservasi, jumlah_pax], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error adding reservasi_rm');
                return;
            }
            res.status(200).send('Reservasi RM added successfully');
        });
    } catch (err) {
        console.error('Error checking ID:', err);
        res.status(500).send('Error checking ID');
    }
};

exports.getReservasiRm = async (req, res) => {
    const id_user = req.user.id_user;
    const sql = 'SELECT * FROM reservasi_rm WHERE id_user = ? ORDER BY created_at DESC';

    try {
        db.query(sql, [id_user], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error retrieving reservasi_rm');
                return;
            }
            if (result.length === 0) {
                return res.status(404).send('Reservasi RM not found');
            }

            res.status(200).json(result);
        });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error retrieving reservasi_rm');
    }
};


exports.addReservasiKendaraan = async (req, res) => {
    const { id_kendaraan, waktu_pemesanan, total, lokasi } = req.body;
    const id_user = req.user.id_user; // User ID from the logged-in user's session or token


    if (!id_user) {
        return res.status(400).send('User not authenticated or id_user is null');
    }

    try {
        // Check if id_kendaraan exists in the kendaraan table
        const kendaraanExists = await checkIdExists('kendaraan', 'id_kendaraan', id_kendaraan);

        if (!kendaraanExists) {
            return res.status(400).send('Invalid id_kendaraan');
        }

        const sql = 'INSERT INTO reservasi_kendaraan (id_kendaraan, waktu_pemesanan, total, id_user, lokasi, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
        db.query(sql, [id_kendaraan, waktu_pemesanan, total, id_user, lokasi], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error adding reservasi_kendaraan');
                return;
            }
            res.status(200).send('Reservasi kendaraan added successfully');
        });
    } catch (err) {
        console.error('Error checking ID:', err);
        res.status(500).send('Error checking ID');
    }
};

exports.getReservasiKendaraan = async (req, res) => {
    const id_user = req.user.id_user;

    const sql = 'SELECT * FROM reservasi_kendaraan WHERE id_user = ?';

    try {
        db.query(sql, [id_user], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error retrieving reservasi_kendaraan');
                return;
            }

            if (results.length === 0) {
                return res.status(404).send('Reservasi kendaraan not found');
            }

            res.status(200).json(results);
        });
    } catch (err) {
        console.error('Error retrieving reservasi_kendaraan:', err);
        res.status(500).send('Error retrieving reservasi_kendaraan');
    }

};

//FILTER WISATA
exports.getWisataByLocation = async (req, res) => {
    const { lokasi } = req.query; // Lokasi yang digunakan sebagai filter diambil dari query parameters

    // SQL query dasar
    let sql = 'SELECT id_wisata, nama_wisata, lokasi, harga_tiket, gambar_wisata FROM wisata';

    // Jika lokasi disediakan, tambahkan kondisi WHERE untuk memfilter berdasarkan lokasi
    if (lokasi) {
        sql += ' WHERE lokasi LIKE ?';
    }

    try {
        // Eksekusi query dengan atau tanpa filter lokasi
        db.query(sql, lokasi ? [`%${lokasi}%`] : [], (err, results) => {
            if (err) {
                console.error('Error fetching wisata:', err);
                res.status(500).send('Error fetching wisata');
                return;
            }

            if (results.length === 0) {
                return res.status(404).send('No wisata found for the given location');
            }

            res.status(200).json(results); // Mengembalikan hasil wisata sebagai JSON
        });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error executing query');
    }
};

