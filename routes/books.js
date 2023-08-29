import express from 'express';
import { Book } from '../models/book.js';
import { Author } from '../models/author.js';
import path from 'path';
import 'dotenv/config';
import fs from 'fs';
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];
const router = express.Router();

// All Books Route
router.get('/', async (req, res) => {
  let query = Book.find();
  if (req.query.title !== null && req.query.title !== '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query,
    });
  } catch (err) {
    res.redirect('/');
  }
});

// New Book Route
router.get('/new', async (req, res) => {
  const book = new Book();
  renderNewPage(res, book);
});

// Create Books Route
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    description: req.body.description,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    author: req.body.author,
  });

  saveCover(book, req.body.cover);
  try {
    // console.log(title, description, publishDate, pageCount, req.body.author);
    await book.save();
    res.redirect('/books');
  } catch (error) {
    console.log('error');
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});

    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = 'Error Creating';
    res.render('books/new', params);
  } catch (error) {
    console.log(error);
    res.redirect('/books');
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}
export default router;
