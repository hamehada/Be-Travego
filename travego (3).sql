-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 23 Okt 2024 pada 15.45
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `travego`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `nama` varchar(30) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`id_admin`, `nama`, `username`, `password`) VALUES
(1, 'suga rahardi', 'suga', 'suga123'),
(2, 'jojo', 'admin1', '$2a$12$P53ztO5EIpNnbwJJVBmQu.SgtYuxQ2H0P007w4oYPa6d6XgbS7taK'),
(3, 'admin1', 'admin2', '$2a$12$mJki40tMRif8So5wLWO.juYQUkCoi/Gk1Vi/iqQRv/jPOumm/Dey6');

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_pesanan`
--

CREATE TABLE `detail_pesanan` (
  `id_detail` int(11) NOT NULL,
  `id_paket_wisata` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `sub_total` int(11) NOT NULL,
  `id_pesanan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `detail_pesanan`
--

INSERT INTO `detail_pesanan` (`id_detail`, `id_paket_wisata`, `qty`, `harga`, `sub_total`, `id_pesanan`) VALUES
(1, 1, 1, 850000, 850000, 1),
(2, 1, 2, 850000, 2550000, 2),
(3, 1, 4, 850000, 2550000, 3),
(4, 1, 5, 850000, 2550000, 4),
(5, 1, 5, 850000, 2550000, 5),
(6, 1, 5, 850000, 4250000, 6),
(7, 1, 6, 850000, 5100000, 11),
(8, 2, 2, 650000, 1300000, 12),
(9, 2, 4, 650000, 2600000, 13),
(10, 2, 1, 650000, 650000, 14),
(11, 1, 2, 850000, 1700000, 15),
(12, 3, 4, 800000, 3200000, 16),
(13, 1, 3, 850000, 2550000, 17);

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_pesanan_kendaraan`
--

CREATE TABLE `detail_pesanan_kendaraan` (
  `id_pesanan_kendaraan` int(11) NOT NULL,
  `id_pesanan` int(11) NOT NULL,
  `id_kendaraan` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `subtotal` int(11) NOT NULL,
  `lokasi_penjemputan` text NOT NULL,
  `waktu_penjemputan` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `hotel`
--

CREATE TABLE `hotel` (
  `id_hotel` int(11) NOT NULL,
  `nama_hotel` varchar(30) NOT NULL,
  `harga_kamar` int(11) NOT NULL,
  `alamat_hotel` varchar(50) NOT NULL,
  `phone_hotel` varchar(13) NOT NULL,
  `jumlah_kamar` int(11) NOT NULL,
  `gambar_hotel` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kendaraan`
--

CREATE TABLE `kendaraan` (
  `id_kendaraan` int(11) NOT NULL,
  `tipe_kendaraan` varchar(55) NOT NULL,
  `no_kendaraan` varchar(10) NOT NULL,
  `jumlah_seat` int(11) NOT NULL,
  `harga_sewa` int(11) NOT NULL,
  `nama_kendaraan` varchar(50) DEFAULT NULL,
  `gambar_kendaraan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kendaraan`
--

INSERT INTO `kendaraan` (`id_kendaraan`, `tipe_kendaraan`, `no_kendaraan`, `jumlah_seat`, `harga_sewa`, `nama_kendaraan`, `gambar_kendaraan`) VALUES
(1, 'avanza', 'AB 5445 EZ', 7, 450000, 'Avanza', 'avanza.jpeg'),
(2, 'xenia', 'AB 5333 EZ', 5, 550000, 'Xenia', 'xenia.jpg'),
(3, 'mini bus', 'AB 54445 C', 3, 450000, 'brio', 'brio.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `paket_wisata`
--

CREATE TABLE `paket_wisata` (
  `id_paket` int(11) NOT NULL,
  `nama_paket` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `id_rm` int(11) NOT NULL,
  `id_hotel` int(11) NOT NULL,
  `id_kendaraan` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `id_wisata` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `paket_wisata`
--

INSERT INTO `paket_wisata` (`id_paket`, `nama_paket`, `deskripsi`, `id_rm`, `id_hotel`, `id_kendaraan`, `harga`, `id_wisata`) VALUES
(1, 'Paket wisata 3 hari 2 malam', 'Day 01\r\nPenjemputan Area Jogja Pagi\r\nWisata Pantai Gunung Kidul\r\nMakan Siang Lokal Resto\r\nPinus Pengger\r\nWisata Heha Sky View\r\nMakan Malam Lokal resto\r\nCheck in Hotel\r\nDay 02\r\nSarapan dihotel\r\nWisata Borobudur\r\nSvarga Bumi\r\nMakan Siang Lokal Resto\r\nStudio Alam Gamplong\r\nMakan malam\r\nKembali Kehotel\r\nFree Program Malioboro\r\nDay 03\r\nSarapan dihotel\r\nWisata Kraton\r\nTaman Sari\r\nMakan Siang lokal resto\r\nPusat Oleh-oleh\r\nDrop off stasiun/Menyesuaikan\r\n', 1, 1, 1, 850000, 6),
(2, 'Paket 3 Hari Family Tour B', 'Paket 3 Hari Family Tour B\r\nWisata Sesuai Untuk Peserta Dewasa\r\nDay 01\r\n-Candi Borobudur(Pelataran)\r\n-Svarga Bumi\r\n-Studio Alam Gamplong\r\nDay 02\r\n-Pantai Indrayanti\r\n-Pantai Baron\r\n-Heha Ocean View\r\nDay 03\r\n-Candi Prambanan\r\n-Obelix Hills\r\n-Tebing Breksi\r\n-Malioboro', 1, 1, 1, 650000, 6),
(3, 'Paket 3 Hari Adventure Jogja B', 'Paket 3 Hari Adventure Jogja B\r\nWisata sesuai untuk Peserta Dewasa\r\nDay 01\r\n-Lava Tour Jeep Merapi\r\n-Candi Prambanan\r\n-Obelix Hills\r\nDay 02\r\n-Goa Pindul Rafting\r\n-Pantai Sadranan\r\n-Heha Sky View\r\nDay 03\r\n-VW Combrio Omah Cantrik\r\n-Studio Alam Gamplong\r\n-Pule payung\r\n-Malioboro', 1, 1, 3, 800000, 6),
(4, 'Paket wisata 3 hari 2 malam', 'Day 01\r\nPenjemputan Area Jogja Pagi\r\nWisata Pantai Gunung Kidul\r\nMakan Siang Lokal Resto\r\nPinus Pengger\r\nWisata Heha Sky View\r\nMakan Malam Lokal resto\r\nCheck in Hotel\r\nDay 02\r\nSarapan dihotel\r\nWisata Borobudur\r\nSvarga Bumi\r\nMakan Siang Lokal Resto\r\nStudio Alam Gamplong\r\nMakan malam\r\nKembali Kehotel\r\nFree Program Malioboro\r\nDay 03\r\nSarapan dihotel\r\nWisata Kraton\r\nTaman Sari\r\nMakan Siang lokal resto\r\nPusat Oleh-oleh\r\nDrop off stasiun/Menyesuaikan\r\n', 1, 1, 1, 950000, 6),
(5, 'Paket wisata 2 hari 2 malam', 'Day 01\r\nPenjemputan Area Jogja Pagi\r\nWisata Pantai Gunung Kidul\r\nMakan Siang Lokal Resto\r\nPinus Pengger\r\nWisata Heha Sky View\r\nMakan Malam Lokal resto\r\nCheck in Hotel\r\nDay 02\r\nSarapan dihotel\r\nWisata Borobudur\r\nSvarga Bumi\r\nMakan Siang Lokal Resto\r\nStudio Alam Gamplong\r\nMakan malam\r\nKembali Kehotel\r\nFree Program Malioboro\r\nDay 03\r\nSarapan dihotel\r\nWisata Kraton\r\nTaman Sari\r\nMakan Siang lokal resto\r\nPusat Oleh-oleh\r\nDrop off stasiun/Menyesuaikan\r\n', 1, 1, 1, 850000, 6);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pesanan`
--

CREATE TABLE `pesanan` (
  `id_pesanan` int(11) NOT NULL,
  `tgl_pesanan` datetime NOT NULL DEFAULT current_timestamp(),
  `id_admin` int(11) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `catatan` text NOT NULL,
  `total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pesanan`
--

INSERT INTO `pesanan` (`id_pesanan`, `tgl_pesanan`, `id_admin`, `id_user`, `catatan`, `total`) VALUES
(1, '2024-06-06 00:00:00', NULL, 15, 'Test', 850000),
(2, '2024-06-15 00:00:00', NULL, 15, 'Test Client', 2550000),
(3, '2024-06-22 00:00:00', NULL, 15, 'Test 2 From Client', 2550000),
(4, '2024-06-09 20:27:03', NULL, 15, 'Oke Noob!', 2550000),
(5, '2024-06-09 20:27:03', NULL, 15, 'Oke Noob!', 2550000),
(6, '2024-06-09 20:27:03', NULL, 15, 'Oke Noob!', 4250000),
(11, '2024-06-09 22:22:05', NULL, 18, '', 5100000),
(12, '2024-06-09 22:34:33', NULL, 18, '', 1300000),
(13, '2024-06-10 08:00:13', NULL, 16, '', 2600000),
(14, '2024-06-13 00:00:00', NULL, 16, '', 650000),
(15, '2024-06-10 13:56:17', NULL, 16, '', 1700000),
(16, '2024-06-11 14:59:01', NULL, 16, 'xxx', 3200000),
(17, '2024-06-29 00:00:00', NULL, 16, '', 2550000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `reservasi_kendaraan`
--

CREATE TABLE `reservasi_kendaraan` (
  `id` int(11) NOT NULL,
  `id_kendaraan` int(11) NOT NULL,
  `waktu_pemesanan` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `lokasi` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `reservasi_kendaraan`
--

INSERT INTO `reservasi_kendaraan` (`id`, `id_kendaraan`, `waktu_pemesanan`, `total`, `id_user`, `lokasi`, `created_at`) VALUES
(1, 1, '2024-10-22 02:42:56', 600000, 20, 'jl imogiri bantul', '2024-10-22 02:42:56'),
(2, 3, '2024-10-22 02:44:46', 600000, 20, 'jl monjali Kab Sleman', '2024-10-22 02:44:46');

-- --------------------------------------------------------

--
-- Struktur dari tabel `reservasi_rm`
--

CREATE TABLE `reservasi_rm` (
  `id` int(11) NOT NULL,
  `id_rm` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `waktu_reservasi` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `jumlah_pax` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `reservasi_rm`
--

INSERT INTO `reservasi_rm` (`id`, `id_rm`, `id_user`, `waktu_reservasi`, `jumlah_pax`, `created_at`) VALUES
(1, 1, 20, '2024-10-22 02:35:10', 10, '2024-10-22 02:35:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rumahmakan`
--

CREATE TABLE `rumahmakan` (
  `id_rm` int(11) NOT NULL,
  `nama_rm` varchar(30) NOT NULL,
  `harga_pax` int(11) NOT NULL,
  `menu` varchar(30) NOT NULL,
  `alamat` varchar(50) NOT NULL,
  `no_tlpn` varchar(13) NOT NULL,
  `jumlah_pax` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rumahmakan`
--

INSERT INTO `rumahmakan` (`id_rm`, `nama_rm`, `harga_pax`, `menu`, `alamat`, `no_tlpn`, `jumlah_pax`) VALUES
(1, 'raos eco', 35000, 'ayam bakar, nasi pecel, soto', 'jl raya maos pati ngawi jawa timur', '08213456789', 10),
(2, 'bintang timur', 35000, 'nasi goreng', 'jl imogiri', '089513713', 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `nama` varchar(50) NOT NULL,
  `no_hp` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `id_user` int(11) NOT NULL,
  `password` text NOT NULL,
  `username` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`nama`, `no_hp`, `email`, `id_user`, `password`, `username`) VALUES
('vinisiusjr', '2147483647', 'vinijr07@gmail.com', 1, 'vinijr07', 'vinsjr'),
('user1', '2147483647', 'user1@gmail.com', 2, 'user1', 'user'),
('ronaldo', '2147483647', 'cr7@gmail.com', 3, '$2b$10$lw7x3k5O9r9ABZzQOxovye7', 'ronaldo'),
('Ilham', '088888999000', 'ilham123@mail.com', 11, '$2b$10$kwsQdRhkZyXnh.8LUQa5q.BMtT40itHntae/fgTx2PskBZ5WOgr6K', 'ilham1'),
('Denis', '088822448890', 'dnsvns@gmail.com', 15, '$2b$10$407O8WHDKPFsBqymTETZXusgs2qd.Wjqxxli/8SUcTsomh/rvDRNO', 'dnsvns'),
('agus', '08912345678', 'agus@gmai.com', 16, '$2b$10$wXnWBkgsq/AaxYxmZFiqc.mOM2Pr7djcyPEVupKZs86VXagOAOa2C', 'agus123'),
('agus', '08913131', 'agus123@gmail.com', 17, '$2b$10$uFNELnyjIr.61btTmkB0h.17LBUTqe1hfskPVWpEwrxm7Rfg3F8lW', 'agus123'),
('test', '0123', 'test@gmail.com', 18, '$2b$10$793fbslEgRZ.fbn9GjrPUeg4hWQj25FXA.6wA7OxedSLlv8xkd1WO', 'test123'),
('rodry', '009876543', 'rodry12@gmail.com', 19, '$2b$10$l8AUiKgwzVnnteFOoAAwfehHWQdsvAiUMqNLGStX7BF.Mpy7faIRW', 'rodry1234'),
('rodry', '09861636481', 'rodry@gmail.com', 20, '$2b$10$TuN4rYEgEUR.2xc5pBZmbeoGU.T0eSXbGPbpcxDMice.GHyH.KhLu', 'rodry123'),
('user1', '09861636481', 'user1@gmail.com', 21, '$2b$10$HgGgNtI6RfnMq1iFIBkvkeDPFadyfw5gvqNsSMkpzEtab8kfn/qTS', 'user'),
('user2', '09861636481', 'user1@gmail.com', 22, '$2b$10$j8jsOMX6UPdZDQSJQuy4kOyIlzXcEsOiPjQOlHIqCWcx.OfEnwTDC', 'user2');

-- --------------------------------------------------------

--
-- Struktur dari tabel `wisata`
--

CREATE TABLE `wisata` (
  `id_wisata` int(11) NOT NULL,
  `nama_wisata` varchar(30) NOT NULL,
  `lokasi` varchar(50) NOT NULL,
  `harga_tiket` int(11) NOT NULL,
  `gambar_wisata` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `wisata`
--

INSERT INTO `wisata` (`id_wisata`, `nama_wisata`, `lokasi`, `harga_tiket`, `gambar_wisata`) VALUES
(6, 'candi prambanan', 'prambanan sleman', 40000, 'prambanan.webp'),
(7, 'candi prambanan', 'prambanan sleman', 40000, 'prambanan.jpeg'),
(8, 'candi prambanan', 'prambanan sleman', 40000, 'prambanan.jpeg'),
(11, 'candi ceto', 'prambanan', 15000, '1729525762853-607729681-city1.jpg');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indeks untuk tabel `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `id_paket_wisata` (`id_paket_wisata`),
  ADD KEY `id_pesanan` (`id_pesanan`);

--
-- Indeks untuk tabel `detail_pesanan_kendaraan`
--
ALTER TABLE `detail_pesanan_kendaraan`
  ADD PRIMARY KEY (`id_pesanan_kendaraan`),
  ADD KEY `id_kendaraan` (`id_kendaraan`),
  ADD KEY `id_pesanan` (`id_pesanan`);

--
-- Indeks untuk tabel `kendaraan`
--
ALTER TABLE `kendaraan`
  ADD PRIMARY KEY (`id_kendaraan`);

--
-- Indeks untuk tabel `paket_wisata`
--
ALTER TABLE `paket_wisata`
  ADD PRIMARY KEY (`id_paket`),
  ADD KEY `id_hotel` (`id_hotel`),
  ADD KEY `id_kendaraan` (`id_kendaraan`),
  ADD KEY `id_rm` (`id_rm`),
  ADD KEY `id_wisata` (`id_wisata`);

--
-- Indeks untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id_pesanan`),
  ADD KEY `admin` (`id_admin`),
  ADD KEY `pesanan_ibfk_6` (`id_user`);

--
-- Indeks untuk tabel `reservasi_kendaraan`
--
ALTER TABLE `reservasi_kendaraan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `reservasi_rm`
--
ALTER TABLE `reservasi_rm`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rm` (`id_rm`);

--
-- Indeks untuk tabel `rumahmakan`
--
ALTER TABLE `rumahmakan`
  ADD PRIMARY KEY (`id_rm`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- Indeks untuk tabel `wisata`
--
ALTER TABLE `wisata`
  ADD PRIMARY KEY (`id_wisata`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `detail_pesanan_kendaraan`
--
ALTER TABLE `detail_pesanan_kendaraan`
  MODIFY `id_pesanan_kendaraan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `kendaraan`
--
ALTER TABLE `kendaraan`
  MODIFY `id_kendaraan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `paket_wisata`
--
ALTER TABLE `paket_wisata`
  MODIFY `id_paket` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id_pesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `reservasi_kendaraan`
--
ALTER TABLE `reservasi_kendaraan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `reservasi_rm`
--
ALTER TABLE `reservasi_rm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `rumahmakan`
--
ALTER TABLE `rumahmakan`
  MODIFY `id_rm` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `wisata`
--
ALTER TABLE `wisata`
  MODIFY `id_wisata` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD CONSTRAINT `detail_pesanan_ibfk_2` FOREIGN KEY (`id_paket_wisata`) REFERENCES `paket_wisata` (`id_paket`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detail_pesanan_ibfk_3` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `detail_pesanan_kendaraan`
--
ALTER TABLE `detail_pesanan_kendaraan`
  ADD CONSTRAINT `detail_pesanan_kendaraan_ibfk_1` FOREIGN KEY (`id_kendaraan`) REFERENCES `kendaraan` (`id_kendaraan`),
  ADD CONSTRAINT `detail_pesanan_kendaraan_ibfk_2` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`);

--
-- Ketidakleluasaan untuk tabel `paket_wisata`
--
ALTER TABLE `paket_wisata`
  ADD CONSTRAINT `wisata` FOREIGN KEY (`id_wisata`) REFERENCES `wisata` (`id_wisata`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id_admin`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pesanan_ibfk_6` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `reservasi_rm`
--
ALTER TABLE `reservasi_rm`
  ADD CONSTRAINT `reservasi_rm_ibfk_1` FOREIGN KEY (`id_rm`) REFERENCES `rumahmakan` (`id_rm`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
