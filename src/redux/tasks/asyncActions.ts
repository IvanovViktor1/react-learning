import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "index";



 export const fetchTasks = createAsyncThunk(
    'task/fetchTasks', 
    async () => {
      const query = supabase.from("task").select("*").order('id', { ascending: true });
      const {data }= (await query);
   
      return data 
    }
  ); 

  


