const adminControll = require("../controller/web");

module.exports = function (app) {

    // AUTH
    app.route(`/api/admin/login`)
        .post(adminControll.auth_controller.login);

    app.route(`/api/admin/check`)
        .get(adminControll.auth_controller.check);


    // // FUNGSI CRUD HOTEL
    // app.route(`/api/admin/getHotel`)
    //     .get(adminControll.hotel_controller.getHotels);

    // app.route(`/api/admin/getHotel/:id`)
    //     .get(adminControll.hotel_controller.getHotel);

    // app.route(`/api/admin/addHotel/`)
    //     .post(adminControll.hotel_controller.addHotel);

    // app.route(`/api/admin/editHotel/:id`)
    //     .put(adminControll.hotel_controller.editHotel);

    // app.route(`/api/admin/deleteHotel/:id`)
    //     .delete(adminControll.hotel_controller.deleteHotel);


    // FUNGSI CRUD PAKET WISATA
    app.route(`/api/admin/getPaketwisata`)
        .get(adminControll.wisata_controller.getPaketWisatas);

    app.route(`/api/admin/getPaketwisata/:id`)
        .get(adminControll.wisata_controller.getPaketWisata);

    app.route(`/api/admin/editPaketwisata/:id`)
        .put(adminControll.wisata_controller.editPaketwisata);

    app.route(`/api/admin/deletePaketwisata/:id`)
        .delete(adminControll.wisata_controller.deletePaketWisata);

    app.route(`/api/admin/addPaketwisata`)
        .post(adminControll.wisata_controller.addPaketwisata);


    // FUNGSI CRUD WISATA
    app.route(`/api/admin/addWisata`)
        .post(adminControll.wisata_controller.addWisata);

    app.route(`/api/admin/getWisata/:id`)
        .get(adminControll.wisata_controller.getWisata);

    app.route(`/api/admin/editWisata/:id`)
        .put(adminControll.wisata_controller.editWisata);

    app.route(`/api/admin/deleteWisata/:id`)
        .delete(adminControll.wisata_controller.deleteWisata);

    app.route(`/api/admin/getWisata`)
        .get(adminControll.wisata_controller.getWisatas);


    // FUNGSI CRUD KENDARAAN
    app.route(`/api/admin/addKendaraan`)
        .post(adminControll.transport_controller.addKendaraan);

    app.route(`/api/admin/getKendaraan/:id`)
        .get(adminControll.transport_controller.getkendaraan);

    app.route(`/api/admin/deleteKendaraan/:id`)
        .delete(adminControll.transport_controller.deleteKendaraan);

    app.route(`/api/admin/getKendaraan`)
        .get(adminControll.transport_controller.getkendaraans);

    app.route(`/api/admin/editKendaraan/:id`)
        .put(adminControll.transport_controller.editKendaraan);


    // FUNGSI CRUD RUMAHMAKAN
    app.route(`/api/admin/addRumahMakan`)
        .post(adminControll.rm_controller.addRm);

    app.route(`/api/admin/getRumahMakan/:id`)
        .get(adminControll.rm_controller.getRm);

    app.route(`/api/admin/deleteRumahMakan/:id`)
        .delete(adminControll.rm_controller.deleteRm);

    app.route(`/api/admin/getRumahMakan`)
        .get(adminControll.rm_controller.getRms);

    app.route(`/api/admin/editRumahMakan/:id`)
        .put(adminControll.rm_controller.editRm);



    // TRANSAKSI
    app.route(`/api/admin/getTransaksi`)
        .get(adminControll.transaksi_controller.transaksis);

    app.route(`/api/admin/getTransaksi/:id`)
        .get(adminControll.transaksi_controller.transaksi);
}