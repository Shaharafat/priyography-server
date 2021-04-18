import colors from 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import Joi from 'joi';
import joiObjectId from 'joi-objectid';
import initialiseDB from './db/dbConfig.js';
import { debugServer } from './helpers/debugHelpers.js';
import errorMiddleware from './middlewares/error.js';
import orderRouter from './routes/orders.js';
import reviewRouter from './routes/reviews.js';
import serviceRouter from './routes/services.js';
// import routes
import userRouter from './routes/users.js';

// load .env files
dotenv.config();

// connect mongoose
initialiseDB();

// joi object id
Joi.objectId = joiObjectId(Joi);

// create app
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/users', userRouter);
app.use('/reviews', reviewRouter);
app.use('/services', serviceRouter);
app.use('/orders', orderRouter);
// error middleware
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Assalamu alaikum');
});

// server listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  debugServer(colors.green(`👋 Connected to the port ${port} ✌️`));
});
