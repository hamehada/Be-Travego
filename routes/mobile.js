"use strict";

const { authenticateToken } = require('../middleware/auth_user');
//const { verifyToken } = require('../middleware/verifyToken');
module.exports = function (app) {
    let mobileUser = require("../controller/mobile");

    app.route(`/storage/wisata/:name`).get(mobileUser.userController.getImageWisata);

    app.route(`/storage/transport/:name`).get(mobileUser.userController.getImageTransport);

    app.route(`/api/user/register`)
    .post(mobileUser.userController.register);

    app.route(`/api/user/login/`)
    .post(mobileUser.userController.login);

    app.route(`/api/user/editUser`)
    .put(mobileUser.userController.getUser);

    app.route(`/api/user/getWisata`)
    .get(mobileUser.account_controller.getWisata)

    app.route(`/api/user/getkendaraan/:id`)
    .get(mobileUser.account_controller.getkendaraan)

    app.route(`/api/user/getkendaraan/`)
    .get(mobileUser.account_controller.getkendaraan)

    app.route(`/api/user/getHotel/:id`)
    .get(mobileUser.account_controller.getHotel)

    app.route(`/api/user/getPaketwisata/`)
    .get(mobileUser.account_controller.getPaketwisata)

    app.route(`/api/user/datadiri/`)
    .get(authenticateToken,mobileUser.account_controller.datadiri)

    app.route(`/api/user/addDetailPesanan/`)
    .post(authenticateToken,mobileUser.account_controller.addDetailPesanan)

    app.route(`/api/user/createPesananWithDetails/`)
    .post(authenticateToken,mobileUser.account_controller.createPesananWithDetails)

    app.route(`/api/user/createPesananWithDetailsKendaraan/`)
    .post(authenticateToken,mobileUser.account_controller.createPesananWithDetailsKendaraan)

    app.route(`/api/user/viewPesanan/`)
    .get(authenticateToken,mobileUser.account_controller.viewPesanan)

    // app.route(`/api/user/addPesanankendaraan/`)
    // .post(authenticateToken,mobileUser.account_controller.addPesananKendaraan)


    // app.route(`/api/user/addDetailPesananKendaraan/`)
    // .post(authenticateToken,mobileUser.account_controller.addDetailPesananKendaraan)
}

