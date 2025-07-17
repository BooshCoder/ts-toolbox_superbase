import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { NewNote, CheatNote } from '../types/CheatNote';

const BASE_URL = 'https://6878a32163f24f1fdc9ec8d5.mockapi.io/ts';

export const useAddNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newNote: NewNote) =>
      axios.post<CheatNote>(`${BASE_URL}/cheatnotes`, newNote).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheatnotes'] });
    },
  });
};