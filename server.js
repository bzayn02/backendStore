import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';

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

const __dirname = path.resolve();
// converting public folder to static serving folder
app.use(express.static(path.join(__dirname + '/public')));

// ========= Routers ==========
import userRouter from './src/routers/userRouter.js';
app.use('/user', userRouter);
import categoryRouter from './src/routers/categoryRouter.js';
app.use('/categories', categoryRouter);
import productRouter from './src/routers/productRouter.js';
app.use('/products', productRouter);
import paymentRouter from './src/routers/paymentRouter.js';
app.use('/payment-options', paymentRouter);

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
