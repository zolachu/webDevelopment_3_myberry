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
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.use('/', indexRouter);

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('listening for requests');
  });
});


