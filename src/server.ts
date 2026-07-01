import express from "express";
const app = express();
import fs from "fs";
const router = express.Router();

app.get("/users", (req: express.Request, res: express.Response) => {
  fs.readFile("MOCK_Data.json", "utf8", (err: Error | null, data: string) => {
    if (err) {
      res.status(500).end("Error reading users.json");
      return;
    }
    const c = JSON.parse(data);
    res.end(
      "<h1>Users List</h1><ul>" +
        c
          .map((users: { full_name: string }) => `<li>${users.full_name}</li>`)
          .join("") +
        "</ul>",
    );
  });
});

app.get("/users/:id", (req: express.Request, res: express.Response) => {
  const userId = Number(req.params.id);
  fs.readFile("MOCK_DATA.json", "utf8", (err: Error | null, data: string) => {
    if (err) {
      res.status(500).end("Error reading users.json");
      return;
    }
    const users = JSON.parse(data);
    const user = users.find((u: { id: number }) => u.id === userId);
    if (!user) {
      const errorMessage = { message: "User not found" };
      res.status(404).json(errorMessage);
      return;
    }
    res.end(
      `<h1>User Details</h1><p>Name: ${user.full_name}</p><p>Email: ${user.email}</p>`,
    );
  });
});

app.post("/users", (req: express.Request, res: express.Response) => {
  let body = "";
  req.on("data", (chunk: string) => {
    body += chunk;
  });
  req.on("end", () => {
    const newUser = JSON.parse(body);
    fs.readFile("MOCK_DATA.json", "utf8", (err: Error | null, data: string) => {
      if (err) {
        res.status(500).end("Error reading users.json");
        return;
      }
      const users = JSON.parse(data);
      users.push(newUser);
      fs.writeFile(
        "MOCK_DATA.json",
        JSON.stringify(users),
        (err: Error | null) => {
          if (err) {
            res.status(500).end("Error writing to users.json");
            return;
          }
          const successMessage = { message: "User created successfully" };
          res.status(201).json(successMessage);
        },
      );
    });
  });
});

app.patch("/users/:id", (req: express.Request, res: express.Response) => {
  const userId = Number(req.params.id);
  let body = "";
  req.on("data", (chunk: string) => {
    body += chunk;
  });
  req.on("end", () => {
    const updatedUser = JSON.parse(body);
    if ("id" in updatedUser) {
      const errorMessage = { message: "Cannot update user ID" };
      res.status(400).json(errorMessage);
      return;
    }
    fs.readFile("MOCK_DATA.json", "utf8", (err: Error | null, data: string) => {
      if (err) {
        res.status(500).end("Error reading users.json");
        return;
      }
      const users = JSON.parse(data);
      const userIndex = users.findIndex((u: { id: number }) => u.id === userId);
      if (userIndex === -1) {
        const errorMessage = { message: "User not found" };
        res.status(404).json(errorMessage);
        return;
      }
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      fs.writeFile(
        "MOCK_DATA.json",
        JSON.stringify(users),
        (err: Error | null) => {
          if (err) {
            res.status(500).end("Error writing to users.json");
            return;
          }
          const successMessage = { message: "User updated successfully" };
          res.status(200).json(successMessage);
        },
      );
    });
  });
});

app.delete("/users/:id", (req: express.Request, res: express.Response) => {
  const userId = Number(req.params.id);
  fs.readFile("MOCK_DATA.json", "utf8", (err: Error | null, data: string) => {
    if (err) {
      res.status(500).end("Error reading users.json");
      return;
    }
    const users = JSON.parse(data);
    const userIndex = users.findIndex((u: { id: number }) => u.id === userId);
    if (userIndex === -1) {
      const errorMessage = { message: "User not found" };
      res.status(404).json(errorMessage);
      return;
    }
    users.splice(userIndex, 1);
    fs.writeFile(
      "MOCK_DATA.json",
      JSON.stringify(users),
      (err: Error | null) => {
        if (err) {
          res.status(500).end("Error writing to users.json");
          return;
        }
        const successMessage = { message: "User deleted successfully" };
        res.status(200).json(successMessage);
      },
    );
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
