import { Router } from 'express';
import NotebookController from '../controllers/NotebookController';

const notebookRouter = Router();

notebookRouter
  .get('/notebooks', NotebookController.getAll)
  .get('/notebook/:id', NotebookController.getById);

export default notebookRouter;
