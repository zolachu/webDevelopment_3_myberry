import mongoose from 'mongoose';
const { Schema } = mongoose;

const coverImageBasePath = 'uploads/bookcovers';

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    defaultValue: Date.now,
  },
  coverImageName: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author',
  },
});

const Book = mongoose.model('Book', bookSchema);

export { Book, coverImageBasePath };
