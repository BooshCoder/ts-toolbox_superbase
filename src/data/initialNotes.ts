import type { CheatNote } from '../types/CheatNote';


export const initialNotes: CheatNote[] = [
  {
    id: 1,
    question: 'Функція з типізацією аргументів і повернення',
    answer: 'Сигнатура функції з явною типізацією',
    codeExample: `const sum = (a: number, b: number): number => a + b;`,
    category: 'functions',
  },
  {
    id: 2,
    question: 'Enum у TypeScript',
    answer: 'Як створити перелік значень (enum)',
    codeExample: `enum Direction {\n  Up,\n  Down,\n  Left,\n  Right\n}`,
    category: 'other',
  },
  {
    id: 3,
    question: 'Фільтрація масиву',
    answer: 'Приклад фільтрації за умовою',
    codeExample: `const result = items.filter(item => item.active);`,
    category: 'arrays',
  },
];