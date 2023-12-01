import { PayloadAction, createSlice, current,  } from "@reduxjs/toolkit";
import { ModeSliceState, Status} from "./types";
import { fetchModes } from "./asyncActions";


const initialState: ModeSliceState = { 
    modes:[] ,
    status: Status.LOADING,
};

const modeSlice = createSlice({
    name: "modes",
    initialState, 
    reducers: {
     
    }, 
    extraReducers: (builder) => {
        builder.addCase(fetchModes.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.modes = action.payload
        })
        builder.addCase(fetchModes.pending, (state) => {
        state.status = Status.LOADING;
        state.modes = [];
        })
        builder.addCase(fetchModes.rejected, (state) => {
        state.status = Status.ERROR;
        state.modes = [];
        })
    }
})

export const {} = modeSlice.actions;

export default modeSlice.reducer;