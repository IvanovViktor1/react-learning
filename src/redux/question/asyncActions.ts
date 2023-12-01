import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@supabase/supabase-js";
import { Database } from "database/types";
import {  Answer } from "./types";
import { useSelector } from "react-redux";
import { SelectTopicData } from "redux/topic/selectors";

const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
); 
 
 export const fetchQuestions = createAsyncThunk(
    'questions/fetchQuestions', 
    async (topic_id: number) => {
      const {data} = await supabase.from("question").select(`id, title, answers, topic_id`).eq("topic_id", topic_id).order('id', { ascending: true });
      
      if (data) {
        const parsedData = data?.map(obj=> {
         const updatedAnswers = JSON.parse(obj.answers as string); 
         
         return { ...obj, answers: updatedAnswers };
      })
 
      if(parsedData){
              return parsedData
            } else {
              return   data.map(
                obj=> {
                  const updatedAnswers = obj.answers; 
                  console.log(updatedAnswers );
                  return { ...obj, answers: updatedAnswers as Answer };
                }
              ) 
            } 
      } else {
        return []
      }
    }
  );

 
  