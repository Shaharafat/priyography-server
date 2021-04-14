import colors from 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import initialiseDB from './db/dbConfig.js';
import { debugServer } from './helpers/debugHelpers.js';

// load .env files
dotenv.config();

// create app
const app = express();

app.use(cors());
app.use(express.json({ limit: 50 }));

app.get('/', (req, res) => {
  res.send('Assalamu alaikum');
});

// connect mongoose
initialiseDB();

// server listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  debugServer(colors.green(`👋 Connected to the port ${port} ✌️`));
});
