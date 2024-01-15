
export interface AnswerToTaskSliceState {
  answers: TypesAnswerToTask[] | null;
  status: Status ;
}   

export type TypesAnswerToTask={
  id: number
  id_task: number
  link: string 
  date: string
  score: number  |null
  comments: string |null
  user_id: string
}

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

