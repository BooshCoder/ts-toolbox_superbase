import axios from "axios";
import type { CheatNote } from "../types/CheatNote";

const BASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const addCheatNote = async (note: CheatNote) => {
  const { data } = await axios.post(`${BASE_URL}/cheatnotes`, note);
  return data;
};