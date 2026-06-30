const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 3000;

app.get("/users", (req, res) => {
  fs.readFile("./MOCK_DATA.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading users data");
      return;
    }
    const users = JSON.parse(data);
    res.send(
      "<h1>Users List</h1><ul>" +
        users.map((user) => `<li>${user.full_name}</li>`).join("") +
        "</ul>",
    );
  });
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  fs.readFile("./MOCK_DATA.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading users data");
      return;
    }
    const users = JSON.parse(data);
    const user = users.find((u) => u.id === parseInt(userId));
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.send(`<h1>${user.full_name}</h1><p>Email: ${user.email}</p>`);
  });
});

app.post("/users", express.json(), (req, res) => {
  const newUser = req.body;
  fs.readFile("./MOCK_DATA.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading users data");
      return;
    }
    const users = JSON.parse(data);
    users.push(newUser);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error saving new user");
        return;
      }
      res.status(201).send("User added successfully");
    });
  });
});

app.patch("/users/:id", express.json(), (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  fs.readFile("./MOCK_DATA.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading users data");
      return;
    }
    const users = JSON.parse(data);
    const userIndex = users.findIndex((u) => u.id === parseInt(userId));
    if (userIndex === -1) {
      res.status(404).send("User not found");
      return;
    }
    users[userIndex] = { ...users[userIndex], ...updatedData };
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error updating user");
        return;
      }
      res.send("User updated successfully");
    });
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  fs.readFile("./MOCK_DATA.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading users data");
      return;
    }
    let users = JSON.parse(data);
    const userIndex = users.findIndex((u) => u.id === parseInt(userId));
    if (userIndex === -1) {
      res.status(404).send("User not found");
      return;
    }
    users.splice(userIndex, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error deleting user");
        return;
      }
      res.send("User deleted successfully");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
