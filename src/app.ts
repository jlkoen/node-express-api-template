import express from 'express';
import router from './app.route';
import morgan from 'morgan';

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'prod') {
  app.use(morgan('combined'));
} else if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

app.use(router);

export default app;
