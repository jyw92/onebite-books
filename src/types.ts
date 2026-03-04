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
export interface Review {
  bookId: string;
  content: string;
  author: string;
}

export interface ActionState {
  status: boolean;
  message: string;
}
export interface ReviewData {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  bookId: number;
}
