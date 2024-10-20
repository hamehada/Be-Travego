"use strict";

const { BASE_URL } = require('../../constant');
const connection = require('../../src/models/connection')

exports.transaksis = async (req, res) => {
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
      ORDER BY p.tgl_pesanan DESC
    `;

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data transaksi.' });
        }

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

        res.status(200).send(formattedResults);
    });
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
