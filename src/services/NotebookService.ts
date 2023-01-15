import INotebook from '../interfaces/INotebook';
import NotebookScraping from '../scraping/NotebookScraping';

export default class NotebookService {
  static async getAll(): Promise<INotebook[]> {
    const notebooks = await NotebookScraping.getAllNotebooks();
    return notebooks;
  }

}
