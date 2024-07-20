import { LOGIN_SUCCESS, LOGOUT_SUCCESS, SIGNUP_SUCCESS } from "./authActions";
import isAuthenticated from "./authUtils";

const initialState = {
  authStatus: isAuthenticated(),
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        authStatus: true,
        user: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        authStatus: false,
        user: null,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        authStatus: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;