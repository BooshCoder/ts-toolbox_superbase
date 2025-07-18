export type Category =
  | 'functions'
  | 'arrays'
  | 'objects'
  | 'dom'
  | 'async'
  | 'other';

export interface CheatNote {
  id?: string;
  title?: string;
  description?: string;
  code?: string;
  question?: string;
  answer?: string;
  codeExample?: string;
  category: Category;
  isFavorite?: boolean;
}
