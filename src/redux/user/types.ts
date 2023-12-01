
export interface UserSliceState{
  sessionInfo: SessionInfo | null;
  databaseInfo: DatabaseInfo| null;
  status: Status ;
  users: UsersType;
}

export type SessionInfo = {
  user_id: string,
  user_email: string
}
  export type DatabaseInfo = { 
     name: string | null;
     group_id: number | null;
     role_id: number | null;
}

export type UsersType ={
  user_id: string;
  name: string | null;
  group_id: number | null;
  role_id: number | null;
  email: string | null;
}[] | null

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
} 
