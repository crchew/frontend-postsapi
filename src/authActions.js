export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";

export const login = (credentials) => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

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
    const response = await fetch("http://localhost:3000/signup", {
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


