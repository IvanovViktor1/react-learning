import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GroupSliceState, GroupType, Status } from "./types";
import { User } from "@supabase/supabase-js";
import { fetchGroups } from "./asyncActions";




const initialState: GroupSliceState = {
    groups: [],
    status: Status.LOADING,
}; 

const groupSlice = createSlice({
    name: "group",
    initialState, 
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchGroups.fulfilled, (state, action) => {
        state.groups = action.payload as GroupType[];  
        state.status = Status.SUCCESS;
        })
        builder.addCase(fetchGroups.pending, (state) => {
        state.status = Status.LOADING;
        state.groups = [];
        })
        builder.addCase(fetchGroups.rejected, (state) => {
        state.status = Status.ERROR;
        state.groups = [];
        })
    }
})



export default groupSlice.reducer;