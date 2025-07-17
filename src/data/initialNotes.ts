import type { CheatNote } from '../types/CheatNote';


export const initialNotes: CheatNote[] = [
  {
    id: '1',
    title: 'Функція з типізацією аргументів і повернення',
    description: 'Сигнатура функції з явною типізацією',
    code: `const sum = (a: number, b: number): number => a + b;`,
    category: 'functions',
  },
  {
    id: '2',
    title: 'Enum у TypeScript',
    description: 'Як створити перелік значень (enum)',
    code: `enum Direction {\n  Up,\n  Down,\n  Left,\n  Right\n}`,
    category: 'other',
  },
  {
    id: '3',
    title: 'Фільтрація масиву',
    description: 'Приклад фільтрації за умовою',
    code: `const result = items.filter(item => item.active);`,
    category: 'arrays',
  },
];