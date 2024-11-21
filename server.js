const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: ["http://localhost:4200"] }));
app.use(express.json());

app.post("/register", (req, res) => {
  const { username, password, email, fullname } = req.body;

  if (!username || !password || !email) {
    console.log("Error:", "Username, password and email are required");
    return res.status(400).json({
      status: "error",
      message: "Username, password and email are required",
    });
  }

  console.log("Username:", username);
  console.log("Password:", password);
  console.log("Email:", email);
  console.log("Full name:", fullname);

  const response = {
    status: "success",
    message: "Registration data received successfully",
  };

  res.status(200).json(response);
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
