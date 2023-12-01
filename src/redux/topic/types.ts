
export interface TopicSliceState {
  items: TopicType[] | null;
  
  status: Status ;
  selectedCurrent :number ;
} 

export type TopicType = {
  id: number;
  title: string ;
  limitQuestions: number | null;
} 




export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}
