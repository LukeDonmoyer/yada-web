import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const updateSites_action = createAction("updateSites");

const initialState = {
  sites: {},
};

const updateSitesSlice = createSlice({
  name: "updateSites",
  initialState,
  reducers: {
    updateSites(state, action: PayloadAction<any>) {
      state.sites = action.payload;
    },
  },
});

export const { updateSites } = updateSitesSlice.actions;
export default updateSitesSlice;
