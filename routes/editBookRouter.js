const express = require("express");
const editBookController = require("../controllers/editBookController.js");
const editBookRouter = express.Router();

const multer = require('multer');
var bodyParser = require('body-parser');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'book_images/') // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // File name
    }
});

const upload = multer({
    storage: storage
}).single('bookImage');


editBookRouter.get('/editBook/:linkTitle', editBookController.getEditBook);
editBookRouter.post('/editBook', upload, editBookController.postEditBook);

module.exports = editBookRouter;