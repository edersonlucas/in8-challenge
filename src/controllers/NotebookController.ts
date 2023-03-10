import { Request, Response, NextFunction } from 'express';
import NotebookService from '../services/NotebookService';

export default class NotebookController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;
      if (name) {
        const notebooks = await NotebookService.getAllByName(String(name));
        return res.status(200).json(notebooks);
      }
      const notebooks = await NotebookService.getAll();
      return res.status(200).json(notebooks);
    } catch (err) {
      return next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const notebook = await NotebookService.getById(Number(id));
      return res.status(200).json(notebook);
    } catch (err) {
      return next(err);
    }
  }
}
