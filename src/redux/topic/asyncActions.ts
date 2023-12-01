import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostgrestSingleResponse, createClient } from "@supabase/supabase-js";
import { Database, DbResult } from "database/types";
import { TopicType } from "./types";

const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

 export const fetchTopics = createAsyncThunk(
    'topics/fetchTopics', 
    async () => {
      const query = supabase.from("topics").select(`id, title, limitQuestions`).order('id', { ascending: true });
      const {data} = await query!;
      
      return data 
    }
  ); 


//   export const fetchTopics = createAsyncThunk<TopicType[], undefined, {rejectValue: string}>(
//     'topics/fetchTopics',
//     async function (_, {rejectWithValue}) {
//              const query = supabase.from("topics").select(`id, title, description`);
//              const {data} = await query!;
//         return data;
//     }
//   );