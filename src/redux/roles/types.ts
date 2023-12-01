

export interface RoleSliceState {
  roles: RoleType[] ;
  status: Status ; 
}


  export type RoleType = {
    id: number;
    name: string;
}


 export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}