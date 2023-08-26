import dotenv from 'dotenv';

// if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
// }

import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from "path";
import {dirname} from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import indexRouter from './routes/index.js';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.set('layout', "layouts/layout");
app.use(expressLayouts);
app.use(express.static('public'));

import mongoose from 'mongoose';

main().catch(err => console.log(err));

async function main() {
  console.log('here');
  await mongoose.connect(process.env.DATABASE_URL).then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log(`listening on ${port}`);
    });
  });
  console.log('hi');
  const db = mongoose.connection;

  db.on('error', (error) => {
    console.log(error);
  });
  db.once('open', () => {
    console.log('connection established');
  });
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use('/', indexRouter);
