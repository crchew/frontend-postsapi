import { useState, useEffect } from "react";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Container } from "react-bootstrap";
import addPostIcon from "../assets/icons8-add.png";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleEditPost = (postId) => {
    navigate(`/edit/${postId}`);
  };

  useEffect(() => {
    // Handle case where token is not available
    if (!token) {
      return;
    }
    // If token is valid, fetch the posts published by user
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://backend-postsapi.vercel.app/blogposts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token, setPosts, setLoading]);

  const deletePost = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      console.log(`Deleting post with id: ${id}`);
      fetch(`https://backend-postsapi.vercel.app/blogposts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete post");
          }
          console.log("Post deleted successfully");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
        });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Container>
      {loading ? (
        <div className="text-center">
          <h4>Loading...</h4>
          {/* Optionally add a spinner or loading animation */}
        </div>
      ) : (
        <div>
          {/* If no posts are found in db, return the following text and photo */}
          {posts.length === 0 ? (
            <div className="text-center">
              <h4>Welcome!</h4>
              <div className="mb-4">
                <a href="/newpost" className="text-decoration-none color-">
                  Publish your first post today
                </a>
              </div>

              {/* Cat image */}
              <img
                src="../src/assets/daria-nepriakhina-p6ac4ss5vVM-unsplash.jpg"
                alt="cat on notebook"
                width="60%"
                height="auto"
              />
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-end">
                <a href="/newpost" className="position-fixed top-0 end-4 mt-2">
                  <img
                    src={addPostIcon}
                    alt="Add Post"
                    style={{ width: "3rem" }}
                  />
                </a>
              </div>
              {/* Sort and display posts from latest to oldest */}
              {posts
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((post) => (
                  <div
                    key={post.id}
                    className="blogpost"
                    style={{
                      marginTop: "1rem",
                      marginLeft: "1rem",
                      marginRight: "4rem",
                      padding: "2rem",
                      border: "1px solid #ccc",
                    }}
                  >
                    <ul>
                      <li>
                        <h2
                          style={{
                            paddingBlock: "0.5rem",
                          }}
                        >
                          {post.title}
                        </h2>
                        <p>{post.content}</p>
                        <div className="d-flex justify-content-between">
                          <p>Author: {post.author}</p>
                          <p>
                            Published:{" "}
                            {format(new Date(post.created_at), "PPpp")}
                          </p>
                        </div>
                      </li>
                    </ul>

                    {/* Edit post icon */}
                    <span
                      className="ml-4"
                      onClick={() => handleEditPost(post.id)}
                    >
                      <PiPencilSimpleLineBold />

                      {/* Delete post icon */}
                      <div
                        className="ml-2 d-inline-block"
                        onClick={() => deletePost(post.id)}
                      >
                        <RiDeleteBin5Fill />
                      </div>
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

export default PostList;
