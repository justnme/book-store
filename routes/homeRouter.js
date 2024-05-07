const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const homeController = require("../controllers/homeController.js");
const homeRouter = express.Router();

homeRouter.get('/home', homeController.getHome);

module.exports = homeRouter;