
// Refresh access token to handle token expiration
export const refreshAccessToken = async () => {
  try {
    const response = await fetch(
      "https://backend-postsapi.vercel.app/refresh-token",
      {
        method: "POST",
        credentials: "include", // include cookies in the request
      }
    );

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
