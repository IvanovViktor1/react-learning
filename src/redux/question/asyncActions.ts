import { createAsyncThunk } from "@reduxjs/toolkit";
import {  Answer } from "./types";
import { supabase } from "index";


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

 
  