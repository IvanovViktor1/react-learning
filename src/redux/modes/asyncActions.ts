import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "index";


 export const fetchModes = createAsyncThunk(
    'modes/fetchModes', 
    async () => {
      const query = supabase.from("modes").select("*").order('id', { ascending: true });
      const {data }= (await query);
      return data 
    }
  ); 

  


