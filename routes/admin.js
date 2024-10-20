const adminControll = require("../controller/web");

module.exports = function (app) {

    // AUTH
    app.route(`/api/admin/login`)
        .post(adminControll.auth_controller.login);

    app.route(`/api/admin/check`)
        .get(adminControll.auth_controller.check);

    // FUNGSI CRUD HOTEL
    app.route(`/api/admin/getHotel`)
        .get(adminControll.hotel_controller.getHotels);

    app.route(`/api/admin/getHotel/:id`)
        .get(adminControll.hotel_controller.getHotel);

    app.route(`/api/admin/addHotel/`)
        .post(adminControll.hotel_controller.addHotel);

    app.route(`/api/admin/editHotel/:id`)
        .put(adminControll.hotel_controller.editHotel);


    // FUNGSI CRUD PAKET WISATA
    app.route(`/api/admin/getPaketwisata`)
        .get(adminControll.wisata_controller.getPaketWisatas);

    app.route(`/api/admin/getPaketwisata/:id`)
        .get(adminControll.wisata_controller.getPaketWisata);

    app.route(`/api/admin/addPaketwisata`)
        .post(adminControll.wisata_controller.addPaketwisata);

    // FUNGSI CRUD WISATA
    app.route(`/api/admin/addWisata`)
        .post(adminControll.wisata_controller.addWisata);

    app.route(`/api/admin/getWisata/:id`)
        .get(adminControll.wisata_controller.getWisata);

    app.route(`/api/admin/getWisata`)
        .get(adminControll.wisata_controller.getWisatas);


    // FUNGSI CRUD KENDARAAN
    app.route(`/api/admin/addKendaraan`)
        .post(adminControll.transport_controller.addKendaraan);

    app.route(`/api/admin/getKendaraan/:id`)
        .get(adminControll.transport_controller.getkendaraan);

    app.route(`/api/admin/getKendaraan`)
        .get(adminControll.transport_controller.getkendaraans);

    app.route(`/api/admin/editKendaraan/:id`)
        .put(adminControll.transport_controller.editKendaraan);


    // TRANSAKSI
    app.route(`/api/admin/getTransaksi`)
        .get(adminControll.transaksi_controller.transaksis);

    app.route(`/api/admin/getTransaksi/:id`)
        .get(adminControll.transaksi_controller.transaksi);
}