import { jwtDecode } from "jwt-decode";

// Refresh access token to handle token expiration
const refreshAccessToken = async () => {
  try {
    const response = await fetch("/refresh-token", {
      method: "POST",
      credentials: "include", // include cookies in the request
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data.token;
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
};

const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found in localStorage.");
    return false;
  }

  try {
    const decoded = jwtDecode(token);

    if (!decoded || !decoded.exp) {
      console.log("Invalid token structure.");
      localStorage.removeItem("token");
      return false;
    }

    const now = Date.now().valueOf() / 1000;

    if (decoded.exp < now) {
      console.log("Token has expired.");
      const token = await refreshAccessToken();

      if (!token) {
        localStorage.removeItem("token");
        return false;
      }
    }

    return true;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token has expired");
    } else {
      console.log("Token verification failed:", error.message);
    }
    localStorage.removeItem("token"); // Clear invalid token
    return false;
  }
};

export default isAuthenticated;
