import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { SiteCollection } from "./FirestoreInterfaces";

const sitesSlice = createSlice<
  SiteCollection,
  SliceCaseReducers<SiteCollection>
>({
  name: "sites",
  initialState: {},
  reducers: {
    updateSites(state, action: PayloadAction<SiteCollection>) {
      return action.payload;
    },
  },
});

export const { updateSites } = sitesSlice.actions;
export default sitesSlice;
