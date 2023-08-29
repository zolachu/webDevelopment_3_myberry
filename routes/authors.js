import express from 'express';
import { Author } from '../models/author.js';
import { Book } from '../models/book.js';
const router = express.Router();
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// All author route
router.get('/', async (req, res) => {
  const searchOptions = {};
  if (req.query.search && req.query.search !== '') {
    searchOptions.name = new RegExp(req.query.search, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query.search,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// New author route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});

// Create author route
router.post('/', async (req, res) => {
  //   const author = new Author({
  //     name: req.body.name,
  //   });
  const author = new Author({ name: req.body.name });
  //   const saved = await author.save();
  try {
    await author.save();
    res.redirect(`authors/${author.id}`);
    console.log('successfully saved');
  } catch (error) {
    res.render('authors/new', {
      author: author,
      errorMessage: 'error creating author',
    });
    console.log('couldnt save the author');
  }
});

router.get('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render('authors/show', { author: author, booksByAuthor: books });
  } catch (error) {
    console.log('error');
    res.redirect('/authors');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render('authors/edit', { author: author });
  } catch (err) {
    res.redirect('authors');
  }
});

router.put('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${req.params.id}`);
  } catch (err) {
    if (author === undefined) {
      res.redirect('/');
    } else {
      res.redirect('/authors/edit', {
        author: author,
        errorMessage: 'error updating',
      });
    }
  }
});

router.delete('/:id', async (req, res) => {
  let author;
  try {
    console.log('inside try remove block');
    author = await Author.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    res.redirect(`/authors`);
  } catch (err) {
    if (author === undefined) {
      res.redirect('/');
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});
export default router;
