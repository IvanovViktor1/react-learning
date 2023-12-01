

export interface QuestionSliceState {
  questions: Question[] ;
  questionsRnd: Question[] ;
  status: Status ; 
}
 
export type Question =
  | { 
    id: number;  
    title: string;
    answers: Answer[] | null 
    topic_id: number ;
    };

export type SearchQuestionsParams = {
  topic_id: number, 
} 


export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}


export type Answer = {
  id: number
  text: string;
  isCorrect: boolean;
};

