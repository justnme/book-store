const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const shoppingCartController = require("../controllers/shoppingCartController.js");
const shoppingCartRouter = express.Router();

shoppingCartRouter.get('/shoppingCart', shoppingCartController.getShoppingCart);
shoppingCartRouter.post('/shoppingCart', urlencodedParser, shoppingCartController.postShoppingCart);

module.exports = shoppingCartRouter;