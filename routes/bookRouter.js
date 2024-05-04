const express = require("express");
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const bookController = require("../controllers/bookController.js");
const bookRouter = express.Router();

bookRouter.post('/book/:linkTitle', urlencodedParser, bookController.postBook);
bookRouter.post('/book/:linkTitle/deleteBook', urlencodedParser, bookController.postDeleteBook);
bookRouter.post('/book/:linkTitle/deleteReview', urlencodedParser, bookController.postDeleteReview);
bookRouter.get('/book/:linkTitle', bookController.getBook);

module.exports = bookRouter;