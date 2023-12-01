import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FiltersForResults, ResultSliceState, Status, TypeResult } from "./types";
import { fetchRating } from "./asyncActions";

const initialState: ResultSliceState = { 
    results: [],
    all_results: [],
    filter: {
      date:  ["01.02.2023, 00.00", "01.11.2023, 00.00"],
    sumErrors:  null,
    score:   null,
    topic_id:  [1],
    user_id:   null,
    },
    status: Status.LOADING  
}; 
 
const resultSlice = createSlice({   
    name: "results",
    initialState, 
    reducers: {
        setResult(state, action: PayloadAction<TypeResult>) {
        state.results.push({...action.payload});
      },
      setFilter(state, action: PayloadAction<FiltersForResults>) {
        state.filter = action.payload;
      },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRating.fulfilled, (state, action) => {
        state.all_results=action.payload;  
        state.status = Status.SUCCESS;
        })
        builder.addCase(fetchRating.pending, (state) => {
        state.status = Status.LOADING;
        state.all_results= [];
        })
        builder.addCase(fetchRating.rejected, (state) => {
        state.status = Status.ERROR;
        state.all_results = [];
        })
    }
})

export const {setResult, setFilter} = resultSlice.actions;

export default resultSlice.reducer;  