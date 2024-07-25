import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.username) {
          setAuthor(decoded.username);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleAddPost = async (e) => {
    e.preventDefault();
    const newPost = { title, content, author };
    try {
      const response = await fetch(
        "https://backend-postsapi.vercel.app/blogposts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to publish post");
      }

      const data = await response.json();
      alert("Post published successfully.");
      console.log("Post published successfully:", data);
    } catch (error) {
      console.error("Error adding post:", error.message);
    }
    navigate("/");
  };

  // Function to return to previous page (homepage)
  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <Container>
      <div style={{ marginTop: "10rem", marginLeft: "6rem" }}>
        <h2>Publish</h2>
        <Form onSubmit={handleAddPost} style={formStyle}>
          <Form.Group
            controlId="title"
            style={{ marginLeft: "2rem", marginTop: "4rem" }}
          >
            <Form.Label>Title:</Form.Label>
            <br />
            <br />
            <Form.Control
              type="text"
              value={title}
              placeholder="Insert your post title here"
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              required
            />
          </Form.Group>

          <Form.Group
            controlId="content"
            style={{ marginLeft: "2rem", marginTop: "4rem" }}
          >
            <Form.Label>Content:</Form.Label>
            <br />
            <br />
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={contentInputStyle}
              required
            />
          </Form.Group>

          <Form.Group
            controlId="author"
            style={{ marginLeft: "2rem", marginTop: "4rem" }}
          >
            <Form.Label>Author:</Form.Label>
            <br />
            <br />
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={inputStyle}
              disabled
            />
          </Form.Group>

          <div className="text-right">
            <Button
              type="submit"
              style={{
                marginRight: "2rem",
                marginTop: "2rem",
                padding: "0.7rem",
              }}
            >
              Publish
            </Button>

            <Button
              onClick={handleBackClick}
              style={{
                marginRight: "1rem",
                marginTop: "2rem",
                padding: "0.7rem",
                backgroundColor: "#3d3d3d",
              }}
            >
              Back
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

const formStyle = {
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  padding: "1rem",
  borderRadius: "5px",
  backgroundColor: "#fff",
  marginLeft: "2rem",
  marginTop: "4rem",
};

const inputStyle = {
  width: "100%",
  padding: "1.5rem",
  margin: "10px 0",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "0px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  height: "0.5rem",
  fontSize: "1rem",
};

const contentInputStyle = {
  width: "100%",
  padding: "1.5rem",
  margin: "10px 0",
  height: "10rem",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "0px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  fontSize: "1rem",
};

export default AddPost;
