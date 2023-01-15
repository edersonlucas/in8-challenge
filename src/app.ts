import express from 'express';
import ErrorMiddleware from './middleware/ErrorMiddleware';

const app = express();
app.use(ErrorMiddleware.error);

export default app;
