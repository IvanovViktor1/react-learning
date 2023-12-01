import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RoleSliceState, RoleType, Status } from "./types";
import { User } from "@supabase/supabase-js";
import { fetchRoles } from "./asyncActions";



const initialState: RoleSliceState = {
    roles: [],
    status: Status.LOADING,
};

const roleSlice = createSlice({
    name: "role",
    initialState, 
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload as RoleType[];  
        state.status = Status.SUCCESS;
        })
        builder.addCase(fetchRoles.pending, (state) => {
        state.status = Status.LOADING;
        state.roles = [];
        })
        builder.addCase(fetchRoles.rejected, (state) => {
        state.status = Status.ERROR;
        state.roles = [];
        })
    }
})



export default roleSlice.reducer;