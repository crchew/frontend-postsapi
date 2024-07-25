import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (postId) {
      const fetchPostData = async () => {
        try {
          const response = await fetch(
            `https://backend-postsapi.vercel.app/blogposts/${postId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const responseData = await response.json();
          console.log("Fetched data:", responseData);
          const { title, content, author } = responseData.data;
          setTitle(title);
          setContent(content);
          setAuthor(author);
        } catch (error) {
          console.error("Error fetching post details:", error);
          setError("Failed to fetch post details. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPostData();
    }
  }, [postId, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedPost = { title, content, author };
    try {
      const response = await fetch(
        `https://backend-postsapi.vercel.app/blogposts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedPost),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      alert("Post updated successfully");
      console.log("Post updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
      setError("Failed to update post. Please try again later.");
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return isLoading ? (
    <span className="visually-hidden">Loading... </span>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <Container>
      <div style={{ marginTop: "10rem", marginLeft: "6rem" }}>
        <h2>Edit Your Post</h2>
        <Form onSubmit={handleSubmit} style={formStyle}>
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
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
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
};

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

export default EditPost;
