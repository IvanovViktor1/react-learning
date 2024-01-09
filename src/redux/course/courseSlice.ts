import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CourseSliceState, CourseType, Status } from "./types";
import { User } from "@supabase/supabase-js";
import { fetchCourses } from "./asyncActions";




const initialState: CourseSliceState = {
    courses: [],
    status: Status.LOADING,
}; 
 
const courseSlice = createSlice({
    name: "course",
    initialState, 
    reducers: {

    }, 
    extraReducers: (builder) => {
        builder.addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload as CourseType[];  
        state.status = Status.SUCCESS;
        })
        builder.addCase(fetchCourses.pending, (state) => {
        state.status = Status.LOADING;
        state.courses = [];
        })
        builder.addCase(fetchCourses.rejected, (state) => {
        state.status = Status.ERROR;
        state.courses = [];
        })
    }
})



export default courseSlice.reducer;