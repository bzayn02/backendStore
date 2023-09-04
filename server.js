import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const app = express();
const PORT = process.env.PORT || 8001;

// ======== Middlewares =========
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import { mongoConnect } from './src/config/mongoConfig.js';
mongoConnect();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ========= Routers ==========
import categoryRouter from './src/routers/categoryRouter.js';
app.use('/', categoryRouter);
import productRouter from './src/routers/productRouter.js';
app.use('/', productRouter);

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running okay!',
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  const code = error.statusCode || 500;
  res.status(code).json({
    status: 'error',
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server is running at http://localhost:${PORT}`);
});
