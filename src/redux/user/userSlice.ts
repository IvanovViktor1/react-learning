import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DatabaseInfo, SessionInfo, Status, UserSliceState } from "./types";
import {  fetchUserInfoFromDB, fetchUsers } from "./asyncActions";

 

const initialState: UserSliceState = {  
  sessionInfo: null,
  databaseInfo:  null,
  status: Status.LOADING,
  users: null,
}; 

const userSlice = createSlice({ 
    name: "user",
    initialState, 
    reducers: {
      setSessionInfo(state, action: PayloadAction<SessionInfo>) {
        state.sessionInfo= action.payload;
      },
      setDatabaseInfo(state, action: PayloadAction<DatabaseInfo>) {
        state.databaseInfo = action.payload;
      },
      userExit(state){
        state.sessionInfo= null;
        state.databaseInfo= null;
      }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserInfoFromDB.fulfilled, (state, action) => {
        state.databaseInfo = action.payload as DatabaseInfo;  
        state.status = Status.SUCCESS;
        })
        builder.addCase(fetchUserInfoFromDB.pending, (state) => {
        state.status = Status.LOADING;
        state.databaseInfo= null;
        })
        builder.addCase(fetchUserInfoFromDB.rejected, (state) => {
        state.status = Status.ERROR;
        state.databaseInfo= null;
        })
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;  
        state.status = Status.SUCCESS;
        })
        builder.addCase(fetchUsers.pending, (state) => {
        state.status = Status.LOADING;
        state.users= null;
        })
        builder.addCase(fetchUsers.rejected, (state) => {
        state.status = Status.ERROR;
        state.users= null;
        })
    }
})
 
export const {setSessionInfo, setDatabaseInfo,userExit} = userSlice.actions;

export default userSlice.reducer; 