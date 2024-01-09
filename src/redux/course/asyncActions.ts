import { createAsyncThunk } from "@reduxjs/toolkit";
import {  createClient } from "@supabase/supabase-js";
import { Database } from "database/types";
import { CourseType } from "./types";

const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

 export const fetchCourses = createAsyncThunk(
    'course/fetchCourses',
    async () => {
      const {data} = await supabase
      .from("course")
      .select('*')
      .order('id', { ascending: true });

      const newData = data
      if (newData){
        return data as CourseType[]
      }
      
    }
  );

   