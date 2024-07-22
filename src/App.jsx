import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AddPost from "./components/AddPost";
import Error404 from "../pages/404";
import EditPost from "./components/EditPost";
import Layout from "./components/NavLayout";
import isAuthenticated from "./authUtils";
import { useState, useEffect } from "react";

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsAuth(auth);
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/newpost"
              element={
                isAuth ? <AddPost /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/edit/:postId"
              element={
                isAuth ? <EditPost /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/"
              element={
                isAuth ? <HomePage /> : <Navigate to="/login" />
              }
            />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}
