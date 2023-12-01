import { PayloadAction, createSlice, current,  } from "@reduxjs/toolkit";
import {  AnswerToTaskSliceState, Status, TypesAnswerToTask} from "./types";
import {  fetchAnswersToTasks } from "./asyncActions";
import { find } from "lodash";

 
const initialState:  AnswerToTaskSliceState= { 
    answers: null ,
    status: Status.LOADING, 
};

const answer_to_task = createSlice({
    name: "answer_to_task",
    initialState, 
    reducers: {
        updateTaskAnswer(state, action: PayloadAction<TypesAnswerToTask>){
            let findAnswer = state.answers?.find(a => a.id === action.payload.id) as TypesAnswerToTask
            const {id, id_task, link, date, score, comments, user_id, } = action.payload

            findAnswer.id = id;
            findAnswer.id_task =id_task
            findAnswer.link =link
            findAnswer.date =  date
            findAnswer.score =score
            findAnswer.comments = comments
            findAnswer.user_id = user_id

        },
        addTaskAnswer(state, action: PayloadAction<TypesAnswerToTask>){
        const {id, id_task, link, date, score, comments,user_id, } = action.payload

        state.answers?.push(action.payload)
        }
    }, 
    extraReducers: (builder) => {
        builder.addCase(fetchAnswersToTasks.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.answers = action.payload
        }) 
        builder.addCase(fetchAnswersToTasks.pending, (state) => {
        state.status = Status.LOADING;
        state.answers = [];
        })
        builder.addCase(fetchAnswersToTasks.rejected, (state) => {
        state.status = Status.ERROR;
        state.answers = [];
        }) 
    }
})

export const {updateTaskAnswer, addTaskAnswer} = answer_to_task.actions;

export default answer_to_task.reducer;