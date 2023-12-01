import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import topicSlice from "./topic/topicSlice"
import resultSlice from "./results/resultSlice"
import userSlice from "./user/userSlice"
import questionSlice from "./question/questionSlice"
import componentsSlice from "./components/componentsSlice"
import roleSlice from "./roles/roleSlice"
import groupSlice from "./groups/groupSlice"
import linkSlice from "./links/linkSlice";
import modeSlice from "./modes/modeSlice";
import taskSlice from "./tasks/taskSlice";
import answer_to_taskSlice from "./answer_to_task/answer_to_taskSlice";

export const store = configureStore({
    reducer: {
      resultSlice,
      userSlice,
      topicSlice,
      questionSlice,
      componentsSlice,
      roleSlice,
      groupSlice,
      linkSlice,
      modeSlice,
      taskSlice,
      answer_to_taskSlice
    },
  });

  export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch