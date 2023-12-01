import { Json } from "database/types";

export type TypeResult = {
  date: Date, 
  errors: number[] | null,
  id: number , 
  topic_id: number,
  user_id: string,
  score: number, 
}
 
 
export interface ResultSliceState {
  results: TypeResult[]  ;
  all_results: FetchResult ;
  filter: FiltersForResults ;
  status: Status ;
}     

export type FiltersForResults ={
  date:  string  [];
  sumErrors:  number []| null;
  score:  number []| null;
  topic_id:  number [] | null;
  user_id:  string  []| null;
}

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export type FetchResult ={
  date: string;
  errors: number[] | null;
  id: number;
  score: number;
  topic_id: number;
  user_id: string;
  score_for: number | null;
}[] | null

// {
//   user_id: string[] | undefined;
//   date: string;
//   errors: number[] | null;
//   id: number;
//   score: number;
//   topic_id: number;
// }[]