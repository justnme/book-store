const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const genresController = require("../controllers/genresController.js");
const genresRouter = express.Router();

genresRouter.get('/genres', genresController.getGenres);

module.exports = genresRouter;