import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "index";


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



  


