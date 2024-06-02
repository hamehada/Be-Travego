"use strict";

const authMiddleware = require('../middleware/authMiddelware');
module.exports = function (app) {
    let mobileUser = require("../controller/mobile");

    app.route(`/api/user/register`)
    .post(mobileUser.userController.register);

    app.route(`/api/user/login/`)
    .get(mobileUser.userController.login);

    app.route(`/api/user/editUser`)
    .put(mobileUser.userController.getUser);
}