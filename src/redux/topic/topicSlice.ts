import { PayloadAction, createSlice, current,  } from "@reduxjs/toolkit";
import { Status, TopicSliceState, TopicType } from "./types";
import { fetchTopics } from "./asyncActions";

const initialState: TopicSliceState = { 
    items:[] ,
    status: Status.LOADING,
    selectedCurrent: 1, 
};

const topicsSlice = createSlice({
    name: "topics",
    initialState, 
    reducers: {
      setNewLimit(state, action: PayloadAction<number>) {
        let currentLimit = state.items?.find(item => item.id === state.selectedCurrent)?.limitQuestions as number
        currentLimit = action.payload
      },
        setTopicData(state, action) {
        state.items = action.payload; 
      },
      setTopicNewTitle(state, action: PayloadAction<{topic_id: number, title: string}>) {
        let currentTopic = state.items?.find(item => item.id === action.payload.topic_id) as TopicType
        currentTopic.title = action.payload.title
      },
      setCurrentTopic(state, action: PayloadAction<number>) {
        state.selectedCurrent = action.payload
      }
    }, 
    extraReducers: (builder) => {
        builder.addCase(fetchTopics.fulfilled, (state, action) => {
        state.items = action.payload;  
        state.status = Status.SUCCESS;
        })
        builder.addCase(fetchTopics.pending, (state) => {
        state.status = Status.LOADING;
        state.items = [];
        })
        builder.addCase(fetchTopics.rejected, (state) => {
        state.status = Status.ERROR;
        state.items = [];
        })
    }
})

export const {setTopicData, setCurrentTopic, setTopicNewTitle, setNewLimit} = topicsSlice.actions;

export default topicsSlice.reducer;