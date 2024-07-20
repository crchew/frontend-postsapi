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
      const response = await fetch("http://localhost:3000/blogposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

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
        <Form onSubmit={handleAddPost}>
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
              style={{
                height: "0.5rem",
                borderRadius: "25px",
                fontSize: "1rem",
                padding: "1.5rem",
              }}
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
              style={{
                height: "10rem",
                borderRadius: "25px",
                fontSize: "1rem",
                padding: "1.5rem",
              }}
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
              style={{
                height: "0.5rem",
                borderRadius: "25px",
                fontSize: "1rem",
                padding: "1.5rem",
              }}
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
                borderRadius: "10px",
              }}
            >
              Publish
            </Button>

            <Button
              onClick={handleBackClick}
              style={{
                marginRight: "15rem",
                marginTop: "2rem",
                padding: "0.7rem",
                borderRadius: "10px",
                backgroundColor: "gray",
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

export default AddPost;
