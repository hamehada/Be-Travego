"use strict";

const { authenticateToken } = require('../middleware/auth_user');
const authMiddleware = require('../middleware/authMiddelware');
module.exports = function (app) {
    let mobileUser = require("../controller/mobile");

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

    app.route(`/api/user/getHotel/:id`)
    .get(mobileUser.account_controller.getHotel)

    app.route(`/api/user/getPaketwisata/`)
    .get(mobileUser.account_controller.getPaketwisata)

    app.route(`/api/user/datadiri/`)
    .get(authenticateToken,mobileUser.account_controller.datadiri)

}
