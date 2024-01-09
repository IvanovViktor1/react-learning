

export interface CourseSliceState {
  courses: CourseType[] ;
  status: Status ; 
}


  export type CourseType = {
    id: number;
    name: string;
    description: string;
}


 export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}