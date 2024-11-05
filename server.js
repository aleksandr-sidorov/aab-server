const express = require("express");
const app = express();

app.use(express.json());

app.post("/register", (req, res) => {
  const { username, password, email, fullname } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      status: "error",
      message: "Username, password and email are required",
    });
  }

  console.log("Username:", username);
  console.log("Password:", password);
  console.log("Email:", email);

  const response = {
    status: "success",
    message: "Registration data received successfully",
  };

  res.status(200).json(response);
});

const port = 3000;

app.listen(port, () => {
  console.log("Server is running on http://localhost:${port}");
});