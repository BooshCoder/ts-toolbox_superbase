import axios from "axios";
import type { CheatNote } from "../types/CheatNote";

const BASE_URL = "https://6878a32163f24f1fdc9ec8d5.mockapi.io/ts";

export const addCheatNote = async (note: CheatNote) => {
  const { data } = await axios.post(`${BASE_URL}/cheatnotes`, note);
  return data;
};