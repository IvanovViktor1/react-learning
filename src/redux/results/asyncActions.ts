import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostgrestSingleResponse, createClient } from "@supabase/supabase-js";
import { Database, DbResult } from "database/types";
import { FetchResult } from "./types";


const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

 export const fetchRating = createAsyncThunk(
    'results/fetchRating', 
    async () => {
      const query = supabase.from("result").select("*").order('id', { ascending: true });  ;
      const {data} = await query!  ;

      if (data){
        const parsedData = data.map(result => {
          const updatedErrors = JSON.parse(result.errors as string)
          return {...result, errors: updatedErrors};
        })

        if (parsedData){
          return parsedData
        } else {
          return   data.map(
            obj=> {
              const updatedErrors = obj.errors; 
              console.log(updatedErrors );
              return { ...obj, answers: updatedErrors as number[] };
            }
          ) 
        } 
      } else return []
      
      // return data  
    } 
  );  


    