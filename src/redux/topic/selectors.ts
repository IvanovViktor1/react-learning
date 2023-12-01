// SelectTestData
import {RootState} from "../store"
 
export const SelectTopicData = (state: RootState) => state.topicSlice

export const SelectTopicDataById = (id: number) => (state: RootState) => state.topicSlice.items?.find(item => item.id === id)

export const GetCurrentTopic = (state: RootState) => state.topicSlice.selectedCurrent

export const getLimitQuestions = (state: RootState) => state.topicSlice.items?.find(item => item.id === state.topicSlice.selectedCurrent)?.limitQuestions