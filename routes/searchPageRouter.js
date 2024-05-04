const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const searchPageController = require("../controllers/searchPageController.js");
const searchPageRouter = express.Router();

searchPageRouter.get('/searchPage', searchPageController.getSearchPage);
searchPageRouter.post('/searchPage', urlencodedParser, searchPageController.postSearchPage);

module.exports = searchPageRouter;