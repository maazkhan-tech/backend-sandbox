const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  const name = req.query.name || "Guest";
  res.send(`Hello, ${name}! This is the Home Page!`);
});

app.get("/about", (req, res) => {
  res.send("This is the About Page!");
});

app.get("/contact", (req, res) => {
  res.send("This is the Contact Page!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
