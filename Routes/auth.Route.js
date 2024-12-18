const express = require("express");
const route = express.Router();
const authController = require("../Controller/user.controller");
const chatController = require("../Controller/chat.controller")

route.post("/register", authController.register);
route.get('/get-user',authController.getUser);
route.post('/login',authController.login)
route.get('/get-chat',chatController.getChats)

module.exports = route;
