/*
SQLyog Ultimate v12.5.1 (64 bit)
MySQL - 5.7.24 : Database - travego
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`travego` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `travego`;

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(30) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id_admin`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Data for the table `admin` */

insert  into `admin`(`id_admin`,`nama`,`username`,`password`) values 
(1,'suga rahardi','suga','suga123'),
(2,'jojo','admin1','$2a$12$P53ztO5EIpNnbwJJVBmQu.SgtYuxQ2H0P007w4oYPa6d6XgbS7taK'),
(3,'admin1','admin2','$2a$12$mJki40tMRif8So5wLWO.juYQUkCoi/Gk1Vi/iqQRv/jPOumm/Dey6');

/*Table structure for table `detail_pesanan` */

DROP TABLE IF EXISTS `detail_pesanan`;

CREATE TABLE `detail_pesanan` (
  `id_detail` int(11) NOT NULL AUTO_INCREMENT,
  `id_paket_wisata` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `sub_total` int(11) NOT NULL,
  `id_pesanan` int(11) NOT NULL,
  PRIMARY KEY (`id_detail`),
  KEY `id_paket_wisata` (`id_paket_wisata`),
  KEY `id_pesanan` (`id_pesanan`),
  CONSTRAINT `detail_pesanan_ibfk_2` FOREIGN KEY (`id_paket_wisata`) REFERENCES `paket_wisata` (`id_paket`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detail_pesanan_ibfk_3` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

/*Data for the table `detail_pesanan` */

insert  into `detail_pesanan`(`id_detail`,`id_paket_wisata`,`qty`,`harga`,`sub_total`,`id_pesanan`) values 
(1,1,1,850000,850000,1),
(2,1,2,850000,2550000,2),
(3,1,4,850000,2550000,3),
(4,1,5,850000,2550000,4),
(5,1,5,850000,2550000,5),
(6,1,5,850000,4250000,6),
(7,1,6,850000,5100000,11),
(8,2,2,650000,1300000,12),
(9,2,4,650000,2600000,13),
(10,2,1,650000,650000,14),
(11,1,2,850000,1700000,15),
(12,3,4,800000,3200000,16),
(13,1,3,850000,2550000,17);

/*Table structure for table `detail_pesanan_kendaraan` */

DROP TABLE IF EXISTS `detail_pesanan_kendaraan`;

CREATE TABLE `detail_pesanan_kendaraan` (
  `id_pesanan_kendaraan` int(11) NOT NULL AUTO_INCREMENT,
  `id_pesanan` int(11) NOT NULL,
  `id_kendaraan` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `subtotal` int(11) NOT NULL,
  `lokasi_penjemputan` text NOT NULL,
  `waktu_penjemputan` datetime NOT NULL,
  PRIMARY KEY (`id_pesanan_kendaraan`),
  KEY `id_kendaraan` (`id_kendaraan`),
  KEY `id_pesanan` (`id_pesanan`),
  CONSTRAINT `detail_pesanan_kendaraan_ibfk_1` FOREIGN KEY (`id_kendaraan`) REFERENCES `kendaraan` (`id_kendaraan`),
  CONSTRAINT `detail_pesanan_kendaraan_ibfk_2` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `detail_pesanan_kendaraan` */

/*Table structure for table `hotel` */

DROP TABLE IF EXISTS `hotel`;

CREATE TABLE `hotel` (
  `id_hotel` int(11) NOT NULL,
  `nama_hotel` varchar(30) NOT NULL,
  `harga_kamar` int(11) NOT NULL,
  `alamat_hotel` varchar(50) NOT NULL,
  `phone_hotel` varchar(13) NOT NULL,
  `jumlah_kamar` int(11) NOT NULL,
  `gambar_hotel` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `hotel` */

/*Table structure for table `kendaraan` */

DROP TABLE IF EXISTS `kendaraan`;

CREATE TABLE `kendaraan` (
  `id_kendaraan` int(11) NOT NULL AUTO_INCREMENT,
  `tipe_kendaraan` varchar(55) NOT NULL,
  `no_kendaraan` varchar(10) NOT NULL,
  `jumlah_seat` int(11) NOT NULL,
  `harga_sewa` int(11) NOT NULL,
  `nama_kendaraan` varchar(50) DEFAULT NULL,
  `gambar_kendaraan` text NOT NULL,
  PRIMARY KEY (`id_kendaraan`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Data for the table `kendaraan` */

insert  into `kendaraan`(`id_kendaraan`,`tipe_kendaraan`,`no_kendaraan`,`jumlah_seat`,`harga_sewa`,`nama_kendaraan`,`gambar_kendaraan`) values 
(1,'avanza','AB 5445 EZ',7,450000,'Avanza','avanza.jpeg'),
(2,'xenia','AB 5333 EZ',5,550000,'Xenia','xenia.jpg'),
(3,'mini bus','AB 54445 C',3,450000,'brio','brio.jpg');

/*Table structure for table `paket_wisata` */

DROP TABLE IF EXISTS `paket_wisata`;

CREATE TABLE `paket_wisata` (
  `id_paket` int(11) NOT NULL AUTO_INCREMENT,
  `nama_paket` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `harga` int(11) NOT NULL,
  `id_wisata` int(11) NOT NULL,
  PRIMARY KEY (`id_paket`),
  KEY `id_wisata` (`id_wisata`),
  CONSTRAINT `wisata` FOREIGN KEY (`id_wisata`) REFERENCES `wisata` (`id_wisata`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `paket_wisata` */

insert  into `paket_wisata`(`id_paket`,`nama_paket`,`deskripsi`,`harga`,`id_wisata`) values 
(1,'Paket wisata 3 hari 2 malam','Day 01\r\nPenjemputan Area Jogja Pagi\r\nWisata Pantai Gunung Kidul\r\nMakan Siang Lokal Resto\r\nPinus Pengger\r\nWisata Heha Sky View\r\nMakan Malam Lokal resto\r\nCheck in Hotel\r\nDay 02\r\nSarapan dihotel\r\nWisata Borobudur\r\nSvarga Bumi\r\nMakan Siang Lokal Resto\r\nStudio Alam Gamplong\r\nMakan malam\r\nKembali Kehotel\r\nFree Program Malioboro\r\nDay 03\r\nSarapan dihotel\r\nWisata Kraton\r\nTaman Sari\r\nMakan Siang lokal resto\r\nPusat Oleh-oleh\r\nDrop off stasiun/Menyesuaikan\r\n',850000,8),
(2,'Paket 3 Hari Family Tour B','Paket 3 Hari Family Tour B\r\nWisata Sesuai Untuk Peserta Dewasa\r\nDay 01\r\n-Candi Borobudur(Pelataran)\r\n-Svarga Bumi\r\n-Studio Alam Gamplong\r\nDay 02\r\n-Pantai Indrayanti\r\n-Pantai Baron\r\n-Heha Ocean View\r\nDay 03\r\n-Candi Prambanan\r\n-Obelix Hills\r\n-Tebing Breksi\r\n-Malioboro',650000,7),
(3,'Paket 3 Hari Adventure Jogja B','Paket 3 Hari Adventure Jogja B\r\nWisata sesuai untuk Peserta Dewasa\r\nDay 01\r\n-Lava Tour Jeep Merapi\r\n-Candi Prambanan\r\n-Obelix Hills\r\nDay 02\r\n-Goa Pindul Rafting\r\n-Pantai Sadranan\r\n-Heha Sky View\r\nDay 03\r\n-VW Combrio Omah Cantrik\r\n-Studio Alam Gamplong\r\n-Pule payung\r\n-Malioboro',800000,6),
(4,'Paket wisata 3 hari 2 malam','Day 01\r\nPenjemputan Area Jogja Pagi\r\nWisata Pantai Gunung Kidul\r\nMakan Siang Lokal Resto\r\nPinus Pengger\r\nWisata Heha Sky View\r\nMakan Malam Lokal resto\r\nCheck in Hotel\r\nDay 02\r\nSarapan dihotel\r\nWisata Borobudur\r\nSvarga Bumi\r\nMakan Siang Lokal Resto\r\nStudio Alam Gamplong\r\nMakan malam\r\nKembali Kehotel\r\nFree Program Malioboro\r\nDay 03\r\nSarapan dihotel\r\nWisata Kraton\r\nTaman Sari\r\nMakan Siang lokal resto\r\nPusat Oleh-oleh\r\nDrop off stasiun/Menyesuaikan\r\n',950000,11),
(5,'Paket wisata 2 hari 2 malam','Day 01\r\nPenjemputan Area Jogja Pagi\r\nWisata Pantai Gunung Kidul\r\nMakan Siang Lokal Resto\r\nPinus Pengger\r\nWisata Heha Sky View\r\nMakan Malam Lokal resto\r\nCheck in Hotel\r\nDay 02\r\nSarapan dihotel\r\nWisata Borobudur\r\nSvarga Bumi\r\nMakan Siang Lokal Resto\r\nStudio Alam Gamplong\r\nMakan malam\r\nKembali Kehotel\r\nFree Program Malioboro\r\nDay 03\r\nSarapan dihotel\r\nWisata Kraton\r\nTaman Sari\r\nMakan Siang lokal resto\r\nPusat Oleh-oleh\r\nDrop off stasiun/Menyesuaikan\r\n',850000,6);

/*Table structure for table `pesanan` */

DROP TABLE IF EXISTS `pesanan`;

CREATE TABLE `pesanan` (
  `id_pesanan` int(11) NOT NULL AUTO_INCREMENT,
  `tgl_pesanan` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_admin` int(11) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `catatan` text NOT NULL,
  `total` int(11) NOT NULL,
  PRIMARY KEY (`id_pesanan`),
  KEY `admin` (`id_admin`),
  KEY `pesanan_ibfk_6` (`id_user`),
  CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id_admin`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pesanan_ibfk_6` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

/*Data for the table `pesanan` */

insert  into `pesanan`(`id_pesanan`,`tgl_pesanan`,`id_admin`,`id_user`,`catatan`,`total`) values 
(1,'2024-06-06 00:00:00',NULL,15,'Test',850000),
(2,'2024-06-15 00:00:00',NULL,15,'Test Client',2550000),
(3,'2024-06-22 00:00:00',NULL,15,'Test 2 From Client',2550000),
(4,'2024-06-09 20:27:03',NULL,15,'Oke Noob!',2550000),
(5,'2024-06-09 20:27:03',NULL,15,'Oke Noob!',2550000),
(6,'2024-06-09 20:27:03',NULL,15,'Oke Noob!',4250000),
(11,'2024-06-09 22:22:05',NULL,18,'',5100000),
(12,'2024-06-09 22:34:33',NULL,18,'',1300000),
(13,'2024-06-10 08:00:13',NULL,16,'',2600000),
(14,'2024-06-13 00:00:00',NULL,16,'',650000),
(15,'2024-06-10 13:56:17',NULL,16,'',1700000),
(16,'2024-06-11 14:59:01',NULL,16,'xxx',3200000),
(17,'2024-06-29 00:00:00',NULL,16,'',2550000);

/*Table structure for table `reservasi_kendaraan` */

DROP TABLE IF EXISTS `reservasi_kendaraan`;

CREATE TABLE `reservasi_kendaraan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_kendaraan` int(11) NOT NULL,
  `waktu_pemesanan` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `lokasi` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

/*Data for the table `reservasi_kendaraan` */

insert  into `reservasi_kendaraan`(`id`,`id_kendaraan`,`waktu_pemesanan`,`total`,`id_user`,`lokasi`,`created_at`) values 
(1,1,'2024-10-22 09:42:56',600000,20,'jl imogiri bantul','2024-10-22 09:42:56'),
(2,3,'2024-10-22 09:44:46',600000,20,'jl monjali Kab Sleman','2024-10-22 09:44:46');

/*Table structure for table `reservasi_rm` */

DROP TABLE IF EXISTS `reservasi_rm`;

CREATE TABLE `reservasi_rm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_rm` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `waktu_reservasi` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `jumlah_pax` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_rm` (`id_rm`),
  CONSTRAINT `reservasi_rm_ibfk_1` FOREIGN KEY (`id_rm`) REFERENCES `rumahmakan` (`id_rm`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

/*Data for the table `reservasi_rm` */

insert  into `reservasi_rm`(`id`,`id_rm`,`id_user`,`waktu_reservasi`,`jumlah_pax`,`created_at`) values 
(1,1,20,'2024-10-22 09:35:10',10,'2024-10-22 09:35:10');

/*Table structure for table `rumahmakan` */

DROP TABLE IF EXISTS `rumahmakan`;

CREATE TABLE `rumahmakan` (
  `id_rm` int(11) NOT NULL AUTO_INCREMENT,
  `nama_rm` varchar(30) NOT NULL,
  `harga_pax` int(11) NOT NULL,
  `menu` varchar(30) NOT NULL,
  `alamat` varchar(50) NOT NULL,
  `no_tlpn` varchar(13) NOT NULL,
  `jumlah_pax` int(11) NOT NULL,
  PRIMARY KEY (`id_rm`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

/*Data for the table `rumahmakan` */

insert  into `rumahmakan`(`id_rm`,`nama_rm`,`harga_pax`,`menu`,`alamat`,`no_tlpn`,`jumlah_pax`) values 
(1,'raos eco',35000,'ayam bakar, nasi pecel, soto','jl raya maos pati ngawi jawa timur','08213456789',10),
(2,'bintang timur',35000,'nasi goreng','jl imogiri','089513713',3);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `nama` varchar(50) NOT NULL,
  `no_hp` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `password` text NOT NULL,
  `username` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

/*Data for the table `user` */

insert  into `user`(`nama`,`no_hp`,`email`,`id_user`,`password`,`username`) values 
('vinisiusjr','2147483647','vinijr07@gmail.com',1,'vinijr07','vinsjr'),
('user1','2147483647','user1@gmail.com',2,'user1','user'),
('ronaldo','2147483647','cr7@gmail.com',3,'$2b$10$lw7x3k5O9r9ABZzQOxovye7','ronaldo'),
('Ilham','088888999000','ilham123@mail.com',11,'$2b$10$kwsQdRhkZyXnh.8LUQa5q.BMtT40itHntae/fgTx2PskBZ5WOgr6K','ilham1'),
('Denis','088822448890','dnsvns@gmail.com',15,'$2b$10$407O8WHDKPFsBqymTETZXusgs2qd.Wjqxxli/8SUcTsomh/rvDRNO','dnsvns'),
('agus','08912345678','agus@gmai.com',16,'$2b$10$wXnWBkgsq/AaxYxmZFiqc.mOM2Pr7djcyPEVupKZs86VXagOAOa2C','agus123'),
('agus','08913131','agus123@gmail.com',17,'$2b$10$uFNELnyjIr.61btTmkB0h.17LBUTqe1hfskPVWpEwrxm7Rfg3F8lW','agus123'),
('test','0123','test@gmail.com',18,'$2b$10$793fbslEgRZ.fbn9GjrPUeg4hWQj25FXA.6wA7OxedSLlv8xkd1WO','test123'),
('rodry','009876543','rodry12@gmail.com',19,'$2b$10$l8AUiKgwzVnnteFOoAAwfehHWQdsvAiUMqNLGStX7BF.Mpy7faIRW','rodry1234'),
('rodry','09861636481','rodry@gmail.com',20,'$2b$10$TuN4rYEgEUR.2xc5pBZmbeoGU.T0eSXbGPbpcxDMice.GHyH.KhLu','rodry123'),
('user1','09861636481','user1@gmail.com',21,'$2b$10$HgGgNtI6RfnMq1iFIBkvkeDPFadyfw5gvqNsSMkpzEtab8kfn/qTS','user'),
('user2','09861636481','user1@gmail.com',22,'$2b$10$j8jsOMX6UPdZDQSJQuy4kOyIlzXcEsOiPjQOlHIqCWcx.OfEnwTDC','user2');

/*Table structure for table `wisata` */

DROP TABLE IF EXISTS `wisata`;

CREATE TABLE `wisata` (
  `id_wisata` int(11) NOT NULL AUTO_INCREMENT,
  `nama_wisata` varchar(30) NOT NULL,
  `lokasi` varchar(50) NOT NULL,
  `harga_tiket` int(11) NOT NULL,
  `gambar_wisata` text NOT NULL,
  PRIMARY KEY (`id_wisata`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

/*Data for the table `wisata` */

insert  into `wisata`(`id_wisata`,`nama_wisata`,`lokasi`,`harga_tiket`,`gambar_wisata`) values 
(6,'candi prambanan','prambanan sleman',40000,'1729351331300-688548019-95.jpg'),
(7,'candi prambanan','prambanan sleman',40000,'1729691911408-906178655-puncak sosok.jpg'),
(8,'candi prambanan','prambanan sleman',40000,'1729461697625-507725335-DiDesa Coret (6).png'),
(11,'candi ceto','prambanan',15000,'1729525762853-607729681-city1.jpg');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
