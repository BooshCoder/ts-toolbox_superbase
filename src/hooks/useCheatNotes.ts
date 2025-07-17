import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { CheatNote } from '../types/CheatNote';

const BASE_URL = 'https://6878a32163f24f1fdc9ec8d5.mockapi.io/ts';

export const useCheatNotes = () => {
  return useQuery<CheatNote[]>({
    queryKey: ['cheatnotes'],
    queryFn: async () => {
      const [res1, res2] = await Promise.all([
        axios.get(`${BASE_URL}/cheats_1`),
        axios.get(`${BASE_URL}/cheats_2`),
      ]);
      return [...res1.data, ...res2.data].map((item: {
        id: string;
        question: string;
        answer: string;
        codeExample: string;
        category: string;
        isFavorite: boolean;
      }) => ({
        id: item.id,
        title: item.question,
        description: item.answer,
        code: item.codeExample,
        category: item.category as import('../types/CheatNote').Category,
      }));
    },
  });
};

export const useAddCheatNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote: {
      question: string;
      answer: string;
      codeExample: string;
      category: string;
      isFavorite: boolean;
    }) => {
      const [res1, res2] = await Promise.all([
        axios.get(`${BASE_URL}/cheats_1`),
        axios.get(`${BASE_URL}/cheats_2`),
      ]);

      const targetEndpoint =
        res1.data.length <= res2.data.length ? 'cheats_1' : 'cheats_2';

      const response = await axios.post(`${BASE_URL}/${targetEndpoint}`, newNote);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheatnotes'] });
    },
  });
};