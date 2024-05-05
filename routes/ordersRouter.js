const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const ordersController = require("../controllers/ordersController.js");
const ordersRouter = express.Router();

ordersRouter.get('/orders', ordersController.getOrders);
ordersRouter.post('/orders/decline', urlencodedParser, ordersController.postOrdersDecline);
ordersRouter.post('/orders/accept', urlencodedParser, ordersController.postOrdersAccept);

module.exports = ordersRouter;