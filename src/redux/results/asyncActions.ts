import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "index";


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


    