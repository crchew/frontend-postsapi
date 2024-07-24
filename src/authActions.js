export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const CHECK_AUTH = "CHECK_AUTH";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "./authUtils";

export const login = (credentials) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://backend-postsapi.vercel.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      } else {
        alert("Login successful!");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    } catch (error) {
      console.error("Login error:", error);
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    dispatch({ type: LOGOUT_SUCCESS });
  };
};

export const signup = (credentials) => {
  return async (dispatch) => {
    const response = await fetch("https://backend-postsapi.vercel.app/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Signup error response:", errorData);
      throw new Error(errorData.message || "Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    dispatch({ type: "SIGNUP_SUCCESS", payload: data });
    alert("Registration successful!");
  };
};

// Dispatch an action to update the Redux state with the authentication status
// Also manage the token and take action if it is invalid or expired
export const checkAuth = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found in localStorage.");
      dispatch({
        type: CHECK_AUTH,
        payload: { authStatus: false, user: null },
      });
      return false;
    }

    try {
      const decoded = jwtDecode(token);

      if (!decoded || !decoded.exp) {
        console.log("Invalid token structure.");
        localStorage.removeItem("token");
        dispatch({
          type: CHECK_AUTH,
          payload: { authStatus: false, user: null },
        });
        return false;
      }

      const now = Date.now().valueOf() / 1000;

      if (decoded.exp < now) {
        console.log("Token has expired.");
        const newToken = await refreshAccessToken(); // Refresh token function

        if (!newToken) {
          localStorage.removeItem("token");
          dispatch({
            type: CHECK_AUTH,
            payload: { authStatus: false, user: null },
          });
          return false;
        }

        localStorage.setItem("token", newToken);
      }

      console.log("User isAuthenticated");
      dispatch({
        type: CHECK_AUTH,
        payload: { authStatus: true, user: decoded.user },
      });
      return true;
    } catch (error) {
      console.log("Token verification failed:", error.message);
      localStorage.removeItem("token");
      dispatch({
        type: CHECK_AUTH,
        payload: { authStatus: false, user: null },
      });
      return false;
    }
  };
};
