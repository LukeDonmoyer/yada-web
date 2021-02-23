import authSlice from "./FireActions";
import { combineReducers } from "redux";
import updateSitesSlice from "./SiteActions";
import updateUsersSlice from "./UserAction";
import updateChannelTemplatesSlice from "./ChannelTemplateActions";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  sites: updateSitesSlice.reducer,
  updateUsers: updateUsersSlice.reducer,
  updateChannelTemplates: updateChannelTemplatesSlice.reducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
