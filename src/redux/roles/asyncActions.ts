import { createAsyncThunk } from "@reduxjs/toolkit";
import { RoleType } from "./types";
import { supabase } from "index";

 export const fetchRoles = createAsyncThunk(
    'role/fetchRoles',
    async () => {
      const {data} = await supabase
      .from('roles')
      .select('*')
      .order('id', { ascending: true });
 
      const newData = data
      if (newData){
        return data as RoleType[]
      }
      
    }
  );

  