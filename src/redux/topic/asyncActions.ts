import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "index";

 export const fetchTopics = createAsyncThunk(
    'topics/fetchTopics', 
    async () => {
      const query = supabase.from("topics").select(`id, title, limitQuestions`).order('id', { ascending: true });
      const {data} = await query!;
      
      return data 
    }
  ); 

