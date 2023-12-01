
import {RootState} from "../store"

export const SelectResultData = (state: RootState) => state.resultSlice;

export const SelectAllResultData = (state: RootState) => state.resultSlice.all_results

export const SelectFilterResultData = (state: RootState) => state.resultSlice.filter
