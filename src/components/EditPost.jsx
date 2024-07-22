import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { configDotenv } from "dotenv";

configDotenv(); 
const { REACT_VERCEL_URL } = process.env;

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
            `${REACT_VERCEL_URL}/blogposts/${postId}`,
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
        `http://localhost:3000/blogposts/${postId}`,
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
        <Form onSubmit={handleSubmit}>
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
              style={{
                height: "0.5rem",
                borderRadius: "25px",
                fontSize: "1rem",
                padding: "1.5rem",
              }}
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
};

export default EditPost;
