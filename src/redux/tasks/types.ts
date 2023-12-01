
export interface TaskSliceState {
  tasks: TypesTask[] | null;
  currentTask: TypesTask| null;
  status: Status ;
}  

export type TypesTask={
  id: number | null
  description: string 
  link_id: number | null
  topic_id: number | null
  group_id: number 
  deadline: string 
}

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

