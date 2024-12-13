const express = require("express");
const route = express.Router();
const authController = require("../Controller/user.controller");

route.post("/register", authController.register);
route.get('/get-user',authController.getUser);
route.post('/login',authController.login)

module.exports = route;
