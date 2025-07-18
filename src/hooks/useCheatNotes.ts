import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { CheatNote } from '../types/CheatNote';
import { mapSupabaseToCheatNote } from '../utils/mapSupabaseToCheatNote';

const BASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ENDPOINT = '/rest/v1/cheatnotes';
const HEADERS = {
  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

const PAGE_SIZE = 20;

export const useInfiniteCheatNotes = () => {
  return useInfiniteQuery<CheatNote[], Error>({
    queryKey: ['cheatnotes'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axios.get(`${BASE_URL}${ENDPOINT}?limit=${PAGE_SIZE}&offset=${pageParam}`, { headers: HEADERS });
      return (res.data as unknown[]).map(mapSupabaseToCheatNote);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length * PAGE_SIZE;
    },
    initialPageParam: 0,
  });
};

export const useAddCheatNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote: CheatNote) => {
      const response = await axios.post(`${BASE_URL}${ENDPOINT}`, newNote, {
        headers: {
          ...HEADERS,
          Prefer: 'return=representation',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheatnotes'] });
    },
  });
};