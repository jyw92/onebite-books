export interface Book {
  id: number;
  title: string;
  subTitle: string;
  author: string;
  publisher: string;
  description: string;
  coverImgUrl: string;
}
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
