-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 02 Jun 2024 pada 05.52
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
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

--
-- Dumping data untuk tabel `hotel`
--

INSERT INTO `hotel` (`id_hotel`, `nama_hotel`, `harga_kamar`, `alamat_hotel`, `phone_hotel`, `jumlah_kamar`, `gambar_hotel`) VALUES
(1, 'Lotus', 500000, 'jln magelang kab sleman', '08213456789', 120, '19378-crystal-lotus.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kendaraan`
--

CREATE TABLE `kendaraan` (
  `id_kendaraan` int(11) NOT NULL,
  `tipe_kendaraan` varchar(55) NOT NULL,
  `no_kendaraan` varchar(10) NOT NULL,
  `jumlah_seat` int(11) NOT NULL,
  `lokasi_penjemputan` varchar(100) NOT NULL,
  `waktu_penjemputan` datetime NOT NULL,
  `harga_sewa` int(11) NOT NULL,
  `nama_kendaraan` varchar(50) DEFAULT NULL,
  `gambar_kendaraan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kendaraan`
--

INSERT INTO `kendaraan` (`id_kendaraan`, `tipe_kendaraan`, `no_kendaraan`, `jumlah_seat`, `lokasi_penjemputan`, `waktu_penjemputan`, `harga_sewa`, `nama_kendaraan`, `gambar_kendaraan`) VALUES
(1, 'avanza', 'AB 5445 EZ', 7, 'jln yossudarso sleman', '2018-12-25 23:50:55', 450000, NULL, ''),
(2, 'xenia', 'AB 5333 EZ', 5, 'jln malioboro', '2022-12-25 23:50:55', 550000, NULL, ''),
(3, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', 'gambar_kendaraan-1717262763557-122355480'),
(4, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', 'gambar_kendaraan-1717262783648-885467570'),
(5, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', 'gambar_kendaraan-1717262882540-615045737'),
(6, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', 'gambar_kendaraan-1717262905755-44729446'),
(7, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', 'gambar_kendaraan-1717263038454-467230357'),
(8, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', 'gambar_kendaraan-1717263163076-619181568'),
(9, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', 'images.jpeg'),
(10, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', '1717263447819-825084219-images.jpeg'),
(11, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', '1717263541779-4-images.jpeg'),
(12, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', '1717263556728-1-images.jpeg'),
(13, 'mini bus', 'AB 54445 C', 3, 'jl magelang', '2024-12-25 16:50:55', 450000, 'brio', '75833-images.jpeg');

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

-- --------------------------------------------------------

--
-- Struktur dari tabel `pesanan`
--

CREATE TABLE `pesanan` (
  `id_pesanan` int(11) NOT NULL,
  `tgl_pesanan` datetime NOT NULL DEFAULT current_timestamp(),
  `tgl_keberangkatan` datetime NOT NULL,
  `id_admin` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `alamat_penjemputan` varchar(50) NOT NULL,
  `qty` int(11) NOT NULL,
  `catatan` varchar(100) NOT NULL,
  `id_paket` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'raos eco', 35000, 'ayam bakar, nasi pecel, soto', 'jl raya maos pati ngawi jawa timur', '08213456789', 10);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `nama` varchar(24) NOT NULL,
  `no_hp` int(13) NOT NULL,
  `email` varchar(25) NOT NULL,
  `id_user` int(11) NOT NULL,
  `password` varchar(30) NOT NULL,
  `username` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`nama`, `no_hp`, `email`, `id_user`, `password`, `username`) VALUES
('vinisiusjr', 2147483647, 'vinijr07@gmail.com', 1, 'vinijr07', 'vinsjr'),
('user1', 2147483647, 'user1@gmail.com', 2, 'user1', 'user');

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
(6, 'candi prambanan', 'prambanan sleman', 40000, 'gambar_wisata-1717261244472-647016455'),
(7, 'candi prambanan', 'prambanan sleman', 40000, 'gambar_wisata-1717261852397-992579977'),
(8, 'candi prambanan', 'prambanan sleman', 40000, 'images.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indeks untuk tabel `hotel`
--
ALTER TABLE `hotel`
  ADD PRIMARY KEY (`id_hotel`);

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
  ADD KEY `pesanan_ibfk_6` (`id_user`),
  ADD KEY `id_paket` (`id_paket`);

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
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `hotel`
--
ALTER TABLE `hotel`
  MODIFY `id_hotel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `kendaraan`
--
ALTER TABLE `kendaraan`
  MODIFY `id_kendaraan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `paket_wisata`
--
ALTER TABLE `paket_wisata`
  MODIFY `id_paket` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id_pesanan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `rumahmakan`
--
ALTER TABLE `rumahmakan`
  MODIFY `id_rm` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `wisata`
--
ALTER TABLE `wisata`
  MODIFY `id_wisata` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `paket_wisata`
--
ALTER TABLE `paket_wisata`
  ADD CONSTRAINT `paket_wisata_ibfk_1` FOREIGN KEY (`id_hotel`) REFERENCES `hotel` (`id_hotel`),
  ADD CONSTRAINT `paket_wisata_ibfk_2` FOREIGN KEY (`id_kendaraan`) REFERENCES `kendaraan` (`id_kendaraan`),
  ADD CONSTRAINT `paket_wisata_ibfk_3` FOREIGN KEY (`id_rm`) REFERENCES `rumahmakan` (`id_rm`),
  ADD CONSTRAINT `paket_wisata_ibfk_4` FOREIGN KEY (`id_wisata`) REFERENCES `wisata` (`id_wisata`);

--
-- Ketidakleluasaan untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id_admin`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `pesanan_ibfk_6` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `pesanan_ibfk_7` FOREIGN KEY (`id_paket`) REFERENCES `paket_wisata` (`id_paket`) ON DELETE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
