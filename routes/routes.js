const express = require('express');
const router = express.Router();
const { cookiesBooksToJs } = require('../scripts/coockies-to-js.js');
const Books = require('../models/books');

router.get('/shopping-cart', async (req, res) => {
    try {
        const cartItems = cookiesBooksToJs();

        const bookDetails = [];
        for (const title of cartItems) {
            const book = await Books.findOne({ where: { title } });
            if (book) {
                bookDetails.push({
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    image: book.image
                });
            }
        }

        res.render('shopping-cart', { bookDetails });
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
