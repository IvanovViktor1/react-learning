// SelectTestData
import {RootState} from "../store"

export const SelectQuestions = (state: RootState) => state.questionSlice

export const SelectQuestionsByTopic =(topic_id: number) => (state: RootState) => state.questionSlice.questions.filter(q => q.topic_id === topic_id)

export const SelectQuestionsDataByIdId = (id: number) => (state: RootState) => state.questionSlice.questions?.find(question => question.id === id)