import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@supabase/supabase-js";
import { Database} from "database/types";
import { DatabaseInfo} from "./types";
import { userInfoProps } from "components/Header";


const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

 export const fetchUserInfoFromDB = createAsyncThunk(
    'user/fetchUserInfoFromDB',
    async (userInfo: userInfoProps) => {

      const query = supabase.from("user_info").select(`name, group_id, role_id, email`).eq("user_id", `${userInfo.user_id}`);
      const {data} = await query!;
      if (data){
        const newData = data[0]
        return newData as DatabaseInfo
      }
    }
  ); 


  
 export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async () => {

    const query = supabase.from("user_info").select(`"user_id", name, group_id, role_id, email`).order('id', { ascending: true });
    const {data} = await query!;
   return data
  }
); 