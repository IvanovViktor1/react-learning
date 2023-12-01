import { createAsyncThunk } from "@reduxjs/toolkit";
import {  createClient } from "@supabase/supabase-js";
import { Database } from "database/types";
import { GroupType } from "./types";

const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

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

   