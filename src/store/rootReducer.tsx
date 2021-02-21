import authSlice from "./FireActions";
import { combineReducers } from "redux";
import updateSitesSlice from "./SiteActions";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  updateSites: updateSitesSlice.reducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
