const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

module.exports = router;
