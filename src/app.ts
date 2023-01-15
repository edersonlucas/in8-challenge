import express from 'express';
import ErrorMiddleware from './middleware/ErrorMiddleware';
import notebookRouter from './routes/NotebookRouter';

const app = express();
app.use(notebookRouter);

app.use(ErrorMiddleware.error);

export default app;
