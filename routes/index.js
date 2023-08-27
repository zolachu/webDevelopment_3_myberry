import express from 'express';
const router = express.Router();
import { Book } from '../models/book.js';

router.get('/', async (req, res) => {
  let books;
  try {
    books = await Book.find().sort({ createAt: 'desc' }).limit(10).exec();
  } catch (err) {
    books = [];
    console.log(err);
  }
  res.render('index', { books: books });
});

export default router;