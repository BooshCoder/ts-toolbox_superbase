export type Category =
  | 'functions'
  | 'arrays'
  | 'objects'
  | 'dom'
  | 'async'
  | 'other'
  | 'variables'
  | 'loops'
  | 'operators';

export interface CheatNote {
  id?: number;
  question?: string;
  answer?: string;
  codeExample?: string;
  category: Category;
  isFavorite?: boolean;
}
