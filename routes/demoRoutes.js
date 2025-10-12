const express = require('express');
const booksController = require('../controllers/demoController');
const router = express.Router();

// POST request to create a student
router.post('/books',booksController.createBook)
router.get('/books',booksController.getBooks)
router.put('/books/:id',booksController.updateBook)
router.delete('/books/:id',booksController.deleteBook)


module.exports = router;