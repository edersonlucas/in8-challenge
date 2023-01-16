import express from 'express';
import swaggerUi from 'swagger-ui-express';
import ErrorMiddleware from './middleware/ErrorMiddleware';
import notebookRouter from './routes/NotebookRouter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocs = require('../swagger.json');

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(notebookRouter);
app.use(ErrorMiddleware.error);

export default app;
