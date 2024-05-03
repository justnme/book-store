const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const homeController = require("../controllers/homeController.js");
const homeRouter = express.Router();

homeRouter.get('/home', homeController.getHome);
homeRouter.post('/home', urlencodedParser, homeController.postHome);

module.exports = homeRouter;