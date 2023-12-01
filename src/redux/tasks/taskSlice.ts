import { PayloadAction, createSlice, current,  } from "@reduxjs/toolkit";
import { TaskSliceState, Status, TypesTask} from "./types";
import {  fetchTasks } from "./asyncActions";


const initialState: TaskSliceState = { 
    tasks:[] ,
    currentTask: {
        id: null,
        description: "",
        link_id:  null,
        topic_id:  null,
        group_id: 1,
        deadline: ""
    },
    status: Status.LOADING,
};

const taskSlice = createSlice({
    name: "modes",
    initialState, 
    reducers: {
        addNewInitialTask(state, action: PayloadAction<TypesTask>){
            state.currentTask = action.payload
        },
        addNewTask(state, action: PayloadAction<TypesTask>){
            state.tasks?.push(action.payload)
        },
        updateTaskById(state, action: PayloadAction<TypesTask>){
           let findTask = state.tasks?.find(task => task.id === action.payload.id) as TypesTask
           findTask.deadline = action.payload.deadline
           findTask.description = action.payload.description
           findTask.group_id = action.payload.group_id
           findTask.link_id = action.payload.link_id
           findTask.topic_id = action.payload.topic_id
        },
        removeTaskById(state, action: PayloadAction<number>){
            let qq = state.tasks?.filter(task => task.id !== action.payload) as TypesTask[]
            state.tasks = qq
        }
    }, 
    extraReducers: (builder) => {
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.tasks = action.payload
        })
        builder.addCase(fetchTasks.pending, (state) => {
        state.status = Status.LOADING;
        state.tasks = [];
        })
        builder.addCase(fetchTasks.rejected, (state) => {
        state.status = Status.ERROR;
        state.tasks = [];
        }) 
    }
})

export const {addNewInitialTask, updateTaskById, addNewTask,  removeTaskById} = taskSlice.actions;

export default taskSlice.reducer;