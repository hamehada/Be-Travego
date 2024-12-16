"use strict";

const { authenticateToken } = require('../middleware/auth_user');
//const { verifyToken } = require('../middleware/verifyToken');
module.exports = function (app) {
    let mobileUser = require("../controller/mobile");

    app.route(`/storage/wisata/:name`).get(mobileUser.userController.getImageWisata);

    app.route(`/storage/transport/:name`).get(mobileUser.userController.getImageTransport);

    app.route(`/storage/rumahmakan/:name`).get(mobileUser.userController.getImageRumahmakan);

    app.route(`/api/user/register`)
    .post(mobileUser.userController.register);

    app.route(`/api/user/login/`)
    .post(mobileUser.userController.login);

    app.route(`/api/user/edituser/`)
    .put(authenticateToken, mobileUser.userController.editUser);

    app.route(`/api/user/changepassword/`)
    .put(authenticateToken, mobileUser.userController.changePassword);

    app.route(`/api/user/getWisata`)
    .get(mobileUser.account_controller.getWisata)

    app.route(`/api/user/getkendaraan/`)
    .get(mobileUser.account_controller.getkendaraan)

    // app.route(`/api/user/getHotel/:id`)
    // .get(mobileUser.account_controller.getHotel)

    app.route(`/api/user/getPaketwisata/`)
    .get(mobileUser.account_controller.getPaketwisata)

    app.route(`/api/user/getrumahmakan`)
    .get(mobileUser.account_controller.getrumahmakan)

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

    app.route(`/api/user/addPesanankendaraan/`)
    .post(authenticateToken,mobileUser.account_controller.addPesananKendaraan)

    //Resrvasi Kendaraan
    app.route(`/api/user/addDetailPesananKendaraan/`)
    .post(authenticateToken,mobileUser.account_controller.addDetailPesananKendaraan)

    app.route(`/api/user/addReservasiKendaraan/`)
    .post(authenticateToken,mobileUser.account_controller.addReservasiKendaraan)

    app.route(`/api/user/getReservasiKendaraan/`)
    .get(authenticateToken,mobileUser.account_controller.getReservasiKendaraan)

    app.route(`/api/user/addReservasiRm/`)
    .post(authenticateToken,mobileUser.account_controller.addReservasiRm)

    app.route(`/api/user/getReservasiRm/`)
    .get(authenticateToken,mobileUser.account_controller.getReservasiRm)

    app.route(`/api/user/getWisataByLocation/`)
    .get(authenticateToken,mobileUser.account_controller.getWisataByLocation)

}

