const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const loginController = require("../controllers/loginController.js");
const loginRouter = express.Router();

loginRouter.post('/login', urlencodedParser, loginController.postLogin);

module.exports = loginRouter;