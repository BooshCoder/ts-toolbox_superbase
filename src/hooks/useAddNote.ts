import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { CheatNote } from '../types/CheatNote';

const BASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const useAddNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newNote: CheatNote) =>
      axios.post<CheatNote>(`${BASE_URL}/cheatnotes`, newNote).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheatnotes'] });
    },
  });
};