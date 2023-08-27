import express from 'express';
import { Book, coverImageBasePath } from '../models/book.js';
import { Author } from '../models/author.js';
import path from 'path';
import multer from 'multer';
import 'dotenv/config';
// import fs from 'fs';
// import s3fs from '@cyclic.sh/s3fs';


// const fs = s3fs(process.env.S3_BUCKET_NAME);
// console.log(fs.unlink.toString());

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
    console.log(req.query);
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
    // if (book.coverImageName !== null) {
    //   removeBookCover(book.coverImageName);
    // }

    renderNewPage(res, book, true);
  }
});

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    console.log(err);
    console.log('PELASE ERROR');
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
