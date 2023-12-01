
export interface ModeSliceState {
  modes: TypesModes[] | null;
  status: Status ;
}  

export type TypesModes={
  id: number
  name: string
}

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

