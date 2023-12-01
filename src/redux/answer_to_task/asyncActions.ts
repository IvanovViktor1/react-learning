import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@supabase/supabase-js";
import { Database} from "database/types";


const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

 export const fetchAnswersToTasks = createAsyncThunk(
    'answer_to_task/fetchAnswersToTasks', 
    async () => {
      const query = supabase.from("answer_to_task").select("*").order('id', { ascending: true });
      const {data }= (await query);
   
      return data 
    }
  ); 

  
 


  
