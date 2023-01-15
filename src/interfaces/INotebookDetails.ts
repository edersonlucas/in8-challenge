import IVersionNotebook from './IVersionNotebook';

export default interface INotebookDetail {
  title: string;
  description: string;
  versions: IVersionNotebook[];
  rating: {
    qtyReviews: number;
    ratingLevel: number;
  };
}
