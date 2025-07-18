import type { CheatNote } from '../types/CheatNote';

export function mapSupabaseToCheatNote(item: unknown): CheatNote {
  const note = item as Record<string, unknown>;
  return {
    id: note.id as string,
    title: note.question as string,
    description: note.answer as string,
    code: note.codeExample as string,
    category: note.category as import('../types/CheatNote').Category,
    isFavorite: note.isFavorite as boolean,
    question: note.question as string,
    answer: note.answer as string,
    codeExample: note.codeExample as string,
  };
} 