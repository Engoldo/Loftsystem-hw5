const path = require("path");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const authCtrl = require("./controllers/authController");
const newsCtrl = require("./controllers/newsController");
const userCtrl = require("./controllers/userController");
const saveUserImgCtrl = require("./controllers/saveUserImgController");
const User = mongoose.model("user");

router.post("/api/login", authCtrl.login);
router.post("/api/saveNewUser", authCtrl.register);
router.post("/api/authFromToken", authCtrl.authFromToken);

router.get("/api/getNews", newsCtrl.getAll);
router.post("/api/newNews", newsCtrl.addItem);
router.put("/api/updateNews/:id", newsCtrl.updateItem);
router.delete("/api/deleteNews/:id", newsCtrl.removeItem);

router.get("/api/getUsers", userCtrl.getAll);
router.put("/api/updateUser/:id", userCtrl.update);
router.delete("/api/deleteUser/:id", userCtrl.remove);
router.put("/api/updateUserPermission/:id", userCtrl.updateUserPermissions);
router.post("/api/saveUserImage/:id", saveUserImgCtrl);

module.exports = router;
