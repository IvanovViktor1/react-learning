import { createAsyncThunk } from "@reduxjs/toolkit";
import { GroupType } from "./types";
import { supabase } from "index";

 export const fetchGroups = createAsyncThunk(
    'group/fetchGroups',
    async () => {
      const {data} = await supabase
      .from("group")
      .select('*')
      .order('id', { ascending: true });

      const newData = data
      if (newData){
        return data as GroupType[]
      }
      
    }
  );

   