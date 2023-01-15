export default interface INotebook {
  id: number;
  title: string;
  price: {
    value: number;
    currency: string;
  };
  description: string;
  rating: {
    qtyReviews: number;
    ratingLevel: number;
  };
}
