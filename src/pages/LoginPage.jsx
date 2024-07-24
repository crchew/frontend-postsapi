import { Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../authActions";
import { useNavigate } from "react-router-dom";
import isAuthenticated from "../authUtils";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      await dispatch(login({ username, password }));
      isAuthenticated();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      // Display error message to user
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <Row style={{ marginTop: "8rem", textAlign: "center" }}>
      <Col>
        <h1> Have an account? Log in now. </h1>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div className="p-4">
            <label className="pr-2">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div className="p-4">
            <label className="pr-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark">
            Log in
          </button>

          <div className="mt-4">
            <p>
              No account yet? <a href="/signup">Sign up for one</a>
            </p>
          </div>
        </form>
      </Col>
    </Row>
  );
}

const formStyle = {
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  padding: "1rem",
  borderRadius: "5px",
  backgroundColor: "#fff",
  margin: "2rem",
};

const inputStyle = {
  width: "30%",
  padding: "10px",
  margin: "10px 0",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "0px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
};
