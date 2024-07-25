import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AddPost from "./components/AddPost";
import Error404 from "./pages/404";
import EditPost from "./components/EditPost";
import Layout from "./components/NavLayout";
import { checkAuth } from "./authActions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const isAuth = useSelector((state) => state.auth.authStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      await dispatch(checkAuth());
      setAuthChecked(true);
    };

    verifyAuth();
  }, [dispatch]);

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
              element={isAuth ? <AddPost /> : <Navigate to="/login" />}
            />
            <Route
              path="/edit/:postId"
              element={isAuth ? <EditPost /> : <Navigate to="/login" />}
            />
            <Route path="/" element={isAuth ? <HomePage /> : <LandingPage />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}
