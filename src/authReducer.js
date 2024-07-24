import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SIGNUP_SUCCESS,
  CHECK_AUTH,
} from "./authActions";

const initialState = {
  authStatus: false,
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
    case CHECK_AUTH:
      return {
        ...state,
        authStatus: action.payload.authStatus,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

export default authReducer;
