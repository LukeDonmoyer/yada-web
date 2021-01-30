import authTypes from './authTypes';

export const setCurrentUser = (user: any) => {
  return {
    type: authTypes.SET_CURRENT_USER,
    payload: user
  };
};
export const clearCurrentUser = () => ({
  type: authTypes.CLEAR_CURRENT_USER
});