import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import pkg from "pg";
import cors from "cors";
const { Pool } = pkg;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { configDotenv } from "dotenv";
import vendiapkg from '@vendia/serverless-express';
const { createServerlessExpress } = vendiapkg;

// configDotenv(); 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const { DB_URL } = process.env;
const { SECRET_KEY } = process.env;
const { REFRESH_SECRET_KEY } = process.env;

const pool = new Pool({
  connectionString: DB_URL,
});

async function getPostgresVersion() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT version()");
    console.log(res.rows[0]);
  } finally {
    client.release();
  }
}

getPostgresVersion();

// User signup
app.post("/signup", async (req, res) => {
  console.log("Signup request received:", req.body);

  const client = await pool.connect();

  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const userResult = await client.query(
      "SELECT * FROM userdb WHERE username = $1",
      [username]
    );

    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const userEmailResult = await client.query(
      "SELECT * FROM userdb WHERE email = $1",
      [email]
    );

    if (userEmailResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Email has been registered before. Please log in." });
    }

    await client.query(
      "INSERT INTO userdb (username, password, email ) VALUES ($1, $2, $3)",
      [username, hashedPassword, email]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

// User login - authenticate user and issue JWT token
app.post("/login", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM userdb WHERE username = $1",
      [req.body.username]
    );
    const user = result.rows[0];

    if (!user) {
      return res
        .status(400)
        .json({ message: "Username or password incorrect" });
    }

    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    
    if (!passwordIsValid) {
      return res.status(400).json({ auth: false, token: null });
    }

    // Create token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { username: user.username },
      REFRESH_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Send the token
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    return res.status(200).json({ auth: true, token });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Authentication using jwt
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null)
    return res.sendStatus(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = { username: decoded.username };
    console.log("Authenticated user:", req.user.username);
    console.log(
      `Token expires at: ${new Date(decoded.exp * 1000).toISOString()}`
    );
    next();
  });
};

// Refresh token
app.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newToken = jwt.sign({ username: user.username }, SECRET_KEY, {
      algorithm: "HS384",
      expiresIn: "1h",
    });

    res.status(200).json({ token: newToken });
  });
});

// Add posts
app.post("/blogposts", async (req, res) => {
  const client = await pool.connect();
  try {
    const data = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      created_at: new Date().toISOString(),
    };

    const query =
      "INSERT INTO blogposts (title, content, author, created_at) VALUES ($1, $2, $3, $4) RETURNING id";
    const params = [data.title, data.content, data.author, data.created_at];

    const result = await client.query(query, params);
    data.id = result.rows[0].id;

    console.log(`Post created successfully with id ${data.id}`);
    res.json({
      status: "success",
      data: data,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Select all posts published by the logged in user
app.get("/blogposts", authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const username = req.user.username;

    const query = "SELECT * FROM blogposts WHERE author = $1";
    const result = await client.query(query, [username]);
    res.json(result.rows);
  } catch (err) {
    console.log(err.stack);
    res.status(500).json("An error occurred");
  } finally {
    client.release();
  }
});

// Get posts based on post ID for edit post purpose
app.get("/blogposts/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();

  try {
    const getPostQuery =
      "SELECT title, author, content FROM blogposts WHERE id = $1";
    const queryData = [id];
    const result = await client.query(getPostQuery, queryData);

    // Handle case where no post with the given ID exists
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Post not found" });
    } else {
      const post = result.rows[0];
      res.json({
        status: "success",
        message: "Post loaded successfully",
        data: post,
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Update posts based on post ID
app.put("/blogposts/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const client = await pool.connect();

  try {
    const updatedQuery =
      "UPDATE blogposts SET title = $1, content = $2, author = $3, updated_at = $4 WHERE id = $5";
    const queryData = [
      updatedData.title,
      updatedData.content,
      updatedData.author,
      new Date().toISOString(),
      id,
    ];
    await client.query(updatedQuery, queryData);

    res.json({ status: "success", message: "Post updated successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Delete post
app.delete("/blogposts/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();

  try {
    const deleteQuery = "DELETE FROM blogposts WHERE id = $1";
    await client.query(deleteQuery, [id]);
    res.json({
      status: "success",
      message: `Post with id ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/404.html"));
});

// app.listen(3000, () => {
//   console.log("App is listening on port 3000");
// });

export const handler = createServerlessExpress({ app });

