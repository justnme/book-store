const express = require("express");
const addBookController = require("../controllers/addBookController.js");
const addBookRouter = express.Router();

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


addBookRouter.get('/addBook', addBookController.getAddBook);
addBookRouter.post('/addBook', upload, addBookController.postAddBook);

module.exports = addBookRouter;