import { createAsyncThunk } from "@reduxjs/toolkit";
import { CourseType } from "./types";
import { supabase } from "index";

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

   