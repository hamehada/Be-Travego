"use strict";

const { BASE_URL } = require('../../constant');
const connection = require('../../src/models/connection')
const db = require('../../src/models/connection')

exports.transaksis = async (req, res) => {
    let historyPakets = [];
    let historyKendaraans = [];
    let expiredIdPesanans = [];

    const queryHistoryPakets = "SELECT dp.qty, dp.harga, dp.id_pesanan, p.tgl_pesanan, p.catatan, p.total, pw.nama_paket, p.status, p.redirect_url, p.snap_token, p.midtrans_id, u.email, u.nama AS nama_user FROM detail_pesanan dp INNER JOIN pesanan p ON dp.id_pesanan = p.id_pesanan INNER JOIN paket_wisata pw ON dp.id_paket_wisata = pw.id_paket INNER JOIN user u ON p.id_user = u.id_user";

    db.query(queryHistoryPakets, (err, resPakets) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error retrieving history pakets' });
        }
        historyPakets = resPakets;


        const queryHistoryKendaraans = "SELECT dp.qty, dp.harga, dp.id_pesanan, p.tgl_pesanan, p.catatan, p.total, k.nama_kendaraan, k.no_kendaraan, p.status, p.redirect_url, p.snap_token, p.midtrans_id, u.email, u.nama AS nama_user FROM detail_pesanan_kendaraan dp INNER JOIN pesanan p ON dp.id_pesanan = p.id_pesanan INNER JOIN kendaraan k ON dp.id_kendaraan = k.id_kendaraan INNER JOIN user u ON p.id_user = u.id_user";
        db.query(queryHistoryKendaraans, async (err, resKendaraans) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ success: false, message: 'Error retrieving history kendaraans' });
            }
            historyKendaraans = resKendaraans;

            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);

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
            }

            for (const item of historyKendaraans) {
                if (item.status === "Menunggu Pembayaran" && getOneDayAfter(item.tgl_pesanan) < new Date()) {
                    expiredIdPesanans.push(item.id_pesanan);
                }
            }

            const queryUpdateExpiredPesanans = expiredIdPesanans.length > 0 ? "UPDATE pesanan SET status = 'Kadaluarsa' WHERE id_pesanan IN (?)" : "SELECT 1";

            db.query(queryUpdateExpiredPesanans, [expiredIdPesanans], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ success: false, message: 'Error updating expired pesanans' });
                }

                db.query(queryHistoryPakets, (err, resPakets) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return res.status(500).json({ success: false, message: 'Error retrieving history pakets' });
                    }
                    historyPakets = resPakets;

                    db.query(queryHistoryKendaraans, (err, resKendaraans) => {
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
                            email: item?.email,
                            no_hp: item?.no_hp,
                            nama: item?.nama_user,
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
                            email: item?.email,
                            no_hp: item?.no_hp,
                            nama: item?.nama_user,
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

};

exports.transaksi = async (req, res) => {
    const { id } = req.params;
    const sqlQuery = `
      SELECT 
        p.id_pesanan, p.tgl_pesanan, p.catatan, p.total,
        u.id_user, u.nama AS nama_user, u.no_hp, u.email, u.username,
        dp.qty, dp.harga, dp.sub_total,
        pk.id_paket, pk.nama_paket, pk.deskripsi,
        h.id_hotel, h.nama_hotel, h.harga_kamar, h.alamat_hotel, h.phone_hotel, h.jumlah_kamar, h.gambar_hotel,
        k.id_kendaraan, k.nama_kendaraan, k.harga_sewa, k.tipe_kendaraan, k.no_kendaraan, k.jumlah_seat, k.gambar_kendaraan,
        w.id_wisata, w.nama_wisata, w.lokasi, w.harga_tiket, w.gambar_wisata
      FROM pesanan p
      JOIN user u ON p.id_user = u.id_user
      JOIN detail_pesanan dp ON p.id_pesanan = dp.id_pesanan
      JOIN paket_wisata pk ON dp.id_paket_wisata = pk.id_paket
      LEFT JOIN hotel h ON pk.id_hotel = h.id_hotel
      LEFT JOIN kendaraan k ON pk.id_kendaraan = k.id_kendaraan
      LEFT JOIN wisata w ON pk.id_wisata = w.id_wisata
      WHERE p.id_pesanan = ?
    `;

    connection.query(sqlQuery, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data transaksi.' });
        }

        // Jika tidak ada hasil, kembalikan response 404
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
        }

        // Format hasil seperti ORM Prisma
        const formattedResults = results.map((r) => {
            const gambarHotel = r.gambar_hotel
                ? `${BASE_URL}/images/hotel/${r.gambar_hotel}`
                : null;
            const gambarKendaraan = r.gambar_kendaraan
                ? `${BASE_URL}/images/kendaraan/${r.gambar_kendaraan}`
                : null;
            const gambarWisata = r.gambar_wisata
                ? `${BASE_URL}/images/wisata/${r.gambar_wisata}`
                : null;

            return {
                id_pesanan: r.id_pesanan,
                tgl_pesanan: r.tgl_pesanan,
                catatan: r.catatan,
                total: r.total,
                user: {
                    id_user: r.id_user,
                    nama: r.nama_user,
                    no_hp: r.no_hp,
                    email: r.email,
                    username: r.username,
                },
                detail_pesanan: {
                    qty: r.qty,
                    harga: r.harga,
                    sub_total: r.sub_total,
                },
                paket: {
                    id_paket: r.id_paket,
                    nama_paket: r.nama_paket,
                    deskripsi: r.deskripsi,
                    hotel: {
                        id_hotel: r.id_hotel,
                        nama_hotel: r.nama_hotel,
                        harga_kamar: r.harga_kamar,
                        alamat_hotel: r.alamat_hotel,
                        phone_hotel: r.phone_hotel,
                        jumlah_kamar: r.jumlah_kamar,
                        gambar_hotel: gambarHotel,
                    },
                    kendaraan: {
                        id_kendaraan: r.id_kendaraan,
                        nama_kendaraan: r.nama_kendaraan,
                        tipe_kendaraan: r.tipe_kendaraan,
                        no_kendaraan: r.no_kendaraan,
                        jumlah_seat: r.jumlah_seat,
                        harga_sewa: r.harga_sewa,
                        gambar_kendaraan: gambarKendaraan,
                    },
                    wisata: {
                        id_wisata: r.id_wisata,
                        nama_wisata: r.nama_wisata,
                        lokasi: r.lokasi,
                        harga_tiket: r.harga_tiket,
                        gambar_wisata: gambarWisata,
                    },
                },
            };
        });

        res.status(200).send(formattedResults[0]);
    });
};
