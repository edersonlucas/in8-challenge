import { Router } from 'express';
import NotebookController from '../controllers/NotebookController';

const notebookRouter = Router();

notebookRouter
  .get('/notebooks', NotebookController.getAll);
export default notebookRouter;
