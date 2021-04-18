import colors from 'colors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { debugDB } from '../helpers/debugHelpers.js';

dotenv.config();

// connect mongoose
const initialiseDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => debugDB(colors.green('✌️ Connected to mongodb')))
    .catch(() => debugDB(colors.underline.red('👎 mongodb connection failed')));
};

// export module
export default initialiseDB;
