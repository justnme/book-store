const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const registrationController = require("../controllers/registrationController.js");
const registrationRouter = express.Router();

registrationRouter.get('/registration', registrationController.getRegistration);
registrationRouter.post('/registration', urlencodedParser, registrationController.postRegistration);

module.exports = registrationRouter;