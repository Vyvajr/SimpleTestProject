import express from 'express';
// import mongoose from 'mongoose';
// import mockgoose, { Mockgoose } from 'mockgoose';
import categoryRouter from './routes/category';
import * as db from './db/db';

const app = express();
app.use(express.json());
app.use('/category', categoryRouter);

db.connect().then(() => {
  app.listen(3001, () => {
    console.log('The application is listening on port 3001!');
  });
});

export default app;