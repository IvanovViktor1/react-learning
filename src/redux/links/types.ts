
export interface LinkSliceState {
  links: LinkType[] | null;
  types_links: TypesLinks[] | null;
  status: Status ;
}  

export type TypesLinks={
  id: number
  name: string
}

export type LinkType = {
  id: number ;
  description: string;
  link:string;
  topic_id: number | null;
  link_type_id: number | null;
} 





export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export type UpdateDescriptionProps ={
  id: number, description: string
}