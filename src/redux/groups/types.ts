

export interface GroupSliceState {
  groups: GroupType[] ;
  status: Status ; 
}


  export type GroupType = {
    id: number;
    name: string;
}


 export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}