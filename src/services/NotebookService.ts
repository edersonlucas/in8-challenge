import INotebook from '../interfaces/INotebook';
import INotebookDetail from '../interfaces/INotebookDetails';
import NotebookScraping from '../scraping/NotebookScraping';

export default class NotebookService {
  static async getAll(): Promise<INotebook[]> {
    const notebooks = await NotebookScraping.getAllNotebooks();
    return notebooks;
  }

  static async getAllByName(name: string): Promise<INotebook[]> {
    const notebooks = await NotebookScraping.getAllNotebooks();
    const notebooksFilteredByName = notebooks.filter((item: INotebook) =>
      item.title?.toLowerCase().includes(name.toLowerCase()),
    );
    return notebooksFilteredByName;
  }

  static async getById(id: number): Promise<INotebookDetail> {
    const notebook = await NotebookScraping.getNotebookDetailById(id);
    return notebook;
  }
}
