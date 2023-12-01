import { PayloadAction, createSlice, current,  } from "@reduxjs/toolkit";
import { LinkSliceState, LinkType, Status} from "./types";
import { fetchLinks } from "./asyncActions";


const initialState: LinkSliceState = { 
    links:[] ,
    types_links:[],
    status: Status.LOADING,
};

const linkSlice = createSlice({
    name: "links",
    initialState, 
    reducers: {
      updateLinkDescription(state, action: PayloadAction<{id: number, description: string}>){
          let findLink = state.links?.find(link => link.id === action.payload.id) as LinkType
            findLink.description = action.payload.description
      },
      updateLink(state, action:PayloadAction<LinkType>){

        const { description,
            link,
            topic_id,
            link_type_id,
           } = action.payload

       let findLink =  state.links?.find(link => link.id === action.payload.id) as LinkType
       findLink.description = description 
       findLink.link = link 
       findLink.topic_id = topic_id
       findLink.link_type_id = link_type_id 
    }

    }, 
    extraReducers: (builder) => {
        builder.addCase(fetchLinks.fulfilled, (state, action) => {
        state.links = action.payload.dataLinks; 
        state.types_links = action.payload.dataTypesLinks;   
        state.status = Status.SUCCESS;
        })
        builder.addCase(fetchLinks.pending, (state) => {
        state.status = Status.LOADING;
        state.links = [];
        })
        builder.addCase(fetchLinks.rejected, (state) => {
        state.status = Status.ERROR;
        state.links = [];
        })
    }
})

export const {updateLinkDescription, updateLink} = linkSlice.actions;

export default linkSlice.reducer;