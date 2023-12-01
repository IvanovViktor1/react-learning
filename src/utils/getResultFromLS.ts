import { TypeResult } from "../redux/results/types"


export const getResultFromLS = () => {
    const data = localStorage.getItem('result')
    const results =  data? JSON.parse(data) : []
  

    return {
       results: results as TypeResult[] 
    }
} 