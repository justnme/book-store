const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const wishListController = require("../controllers/wishListController.js");
const wishListRouter = express.Router();

wishListRouter.get('/wishList', wishListController.getWishList);

module.exports = wishListRouter;