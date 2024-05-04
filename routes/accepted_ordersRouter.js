const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const accepted_ordersController = require("../controllers/accepted_ordersController.js");
const accepted_ordersRouter = express.Router();

accepted_ordersRouter.get('/accepted_orders', accepted_ordersController.getAccepted_orders);

module.exports = accepted_ordersRouter;