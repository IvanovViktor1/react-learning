import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostgrestSingleResponse, createClient } from "@supabase/supabase-js";
import { Database, DbResult } from "database/types";
import { LinkType, UpdateDescriptionProps } from "./types";


const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

 export const fetchLinks = createAsyncThunk(
    'links/fetchLinks', 
    async () => {
      const queryLinks = supabase.from("link").select("*").order('id', { ascending: true });
      const dataLinks = (await queryLinks).data;

      const queryTypesLinks = supabase.from("type_link").select("*").order('id', { ascending: true });
      const dataTypesLinks = (await queryTypesLinks).data;
     

      const data = {dataLinks, dataTypesLinks}

      return data 
    }
  ); 


 
  // export const updateDescriptionLinksById = createAsyncThunk(
  //   'links/updateDescriptionLinksById', 
  //   async ({id,description}) => {
   
  //     const { data, error } = await supabase
  //     .from('link')
  //     .update({ description: description })
  //     .eq('id', id)
  //     .select()

  //     return data 
  //   }
  // ); 

  


