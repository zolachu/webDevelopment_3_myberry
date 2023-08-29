import mongoose from 'mongoose';
import { Book } from './book.js';
const { Schema } = mongoose;

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre('findOneAndDelete', function (next) {
  console.log('run before remove action!!!');
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      console.log('here');
      next.err;
    } else if (books.length > 0) {
      next(new Error('this author has books still'));
    } else {
      next();
    }
  });
});
const Author = mongoose.model('Author', authorSchema);
export { Author };
