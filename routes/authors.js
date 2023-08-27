import express from 'express';
import { Author } from '../models/author.js';
const router = express.Router();

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
    res.redirect('author');
    console.log('successfully saved');
  } catch (error) {
    res.render('authors/new', {
      author: author,
      errorMessage: 'error creating author',
    });
    console.log('couldnt save the author');
  }
  //   saved.on('erro')
  //     .then((author) => {
  //       res.redirect('author');
  //     })
  //     .catch((error) => {
  //       res.render('authors/new', {
  //         author: author,
  //         errorMessage: 'error creating author',
  //       });
  //     });
  //   res.redirect(`authors/${author.id}`);

  //   author.save().then((err, newAuthor) => {
  //     if (err) {
  //       res.render('/authors/new', {
  //         author: author,
  //         errorMessage: 'error Creating Author',
  //       });
  //     } else {
  //       //   res.redirect(`authors/${newAuthor.id}`);
  //       res.redirect('/authors');
  //     }
});

export default router;
