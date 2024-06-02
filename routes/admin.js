
module.exports = function (app) {
    let adminControll = require("../controller/web");

    app.route(`/api/admin/getHotel/:id`)
    .get(adminControll.hotel_controller.getHotel);

    app.route(`/api/admin/addHotel/`)
    .post(adminControll.hotel_controller.addHotel);

    app.route(`/api/admin/editHotel/:id`)
    .put(adminControll.hotel_controller.editHotel);
    



    app.route(`/api/admin/addPaketwisata`)
    .post(adminControll.wisata_controller.addPaketwisata);

    app.route(`/api/admin/addWisata`)
    .post(adminControll.wisata_controller.addWisata);

    app.route(`/api/admin/getWisata`)
    .get(adminControll.wisata_controller.getWisata);

    app.route(`/api/admin/addKendaraan`)
    .post(adminControll.transport_controller.addKendaraan);

    app.route(`/api/admin/getKendaraan/:id`)
    .get(adminControll.transport_controller.getkendaraan);
}