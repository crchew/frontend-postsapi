import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../authActions";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
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
    const { username, password, email } = formData;
    try {
      await dispatch(signup({ username, password, email })).then(navigate("/"));
    } catch (error) {
      console.error("Signup error:", error);
      const { message } = error;
      // Display error message to user
      alert(`Signup failed: ${message}`);
    }
  };

  return (
    <Row style={{ marginTop: "8rem", textAlign: "center" }}>
      <Col>
        <h1>New here? Sign up for an account.</h1>

        <form onSubmit={handleSubmit} autoComplete="on" style={formStyle}>
          <div className="p-4">
            <label className="pr-2">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              autoComplete="username"
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
              autoComplete="current password"
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div className="p-4">
            <label className="pr-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              autoComplete="user email"
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark">
            Sign Up
          </button>
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
  margin: "2rem"
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