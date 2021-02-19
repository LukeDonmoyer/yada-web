import authSlice from "./FireActions";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
