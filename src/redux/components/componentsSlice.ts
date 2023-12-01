import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {  ComponentsSliceState,} from "./types";



const initialState: ComponentsSliceState = {
    AuthorizationVisible: false,
    RegistrationVisible: false

};

const componentsSlice = createSlice({
    name: "components",
    initialState, 
    reducers: {
        setAuthVisible(state, action: PayloadAction<boolean>) {
        state.AuthorizationVisible = action.payload;
      },
      setRegVisible(state, action: PayloadAction<boolean>) {
        state.RegistrationVisible = action.payload;
      },
    }, 
})

export const {setAuthVisible, setRegVisible} = componentsSlice.actions;

export default componentsSlice.reducer;