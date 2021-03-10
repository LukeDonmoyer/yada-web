import authSlice from './FireActions';
import { combineReducers } from 'redux';
import updateSitesSlice from './SiteActions';
import updateUsersSlice from './UserAction';
import updateChannelTemplatesSlice from './ChannelTemplateActions';
import updateLoggerSlice from './LoggerAction';

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    sites: updateSitesSlice.reducer,
    loggers: updateLoggerSlice.reducer,
    templates: updateChannelTemplatesSlice.reducer,
    users: updateUsersSlice.reducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
