import { Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../authActions";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);

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
      await dispatch(login({ username, password }))
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      // Display error message to user
      setError("Login failed. Please check your credentials.");
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <Row style={{ marginTop: "8rem", textAlign: "center" }}>
      <Col>
        <h1> Have an account? Log in now. </h1>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <label className="pr-2">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
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
              required
            />
          </div>

          <button type="submit" className="btn btn-dark">
            Log in
          </button>
        </form>
      </Col>
    </Row>
  );
}
