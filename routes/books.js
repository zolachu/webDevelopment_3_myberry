import express from 'express';
import { Book, coverImageBasePath } from '../models/book.js';
import { Author } from '../models/author.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

const uploadPath = path.join('public', coverImageBasePath);
const router = express.Router();
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

// All Books Route
router.get('/', async (req, res) => {
  // try {
  //   const authors = await Author.find({});

  //   const books = await Book.find({});
  //   res.render('books/index', { books: books, authors: authors });
  // } catch (error) {
  //   console.log(error);
  // }

  const searchOptions = {};
  if (req.query.search && req.query.search !== '') {
    searchOptions.name = new RegExp(req.query.search, 'i');
  }
  try {
    const books = await Book.find(searchOptions);
    res.render('books/index', {
      books: books,
      searchOptions: req.query.search,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
  // res.render('books/index');
});

// New Book Route
router.get('/new', async (req, res) => {
  const book = new Book();
  renderNewPage(res, book);
  // try {
  //   const authors = await Author.find({});
  //   res.render('books/new', { authors: authors, book: book });
  // } catch (error) {
  //   console.log(error);
  //   res.redirect('/books');
  // }
});

// Create Books Route
router.post('/', upload.single('cover'), async (req, res) => {
  const filename = req.file != null ? req.file.filename : null;

  const book = new Book({
    title: req.body.title,
    description: req.body.description,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: filename,
    author: req.body.author,
  });
  try {
    // console.log(title, description, publishDate, pageCount, req.body.author);
    await book.save();
    console.log('saved');
    res.redirect('/books');
    console.log('haha');
  } catch (error) {
    console.log('error');
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }

    renderNewPage(res, book, true);
  }
});

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    console.log(err);
  });
}

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
export default router;
