import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "index";


 export const fetchAnswersToTasks = createAsyncThunk(
    'answer_to_task/fetchAnswersToTasks', 
    async () => {
      const query = supabase.from("answer_to_task").select("*").order('id', { ascending: true });
      const {data }= (await query);
   
      return data 
    }
  ); 

  
 


  
