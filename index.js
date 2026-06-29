const http = require("http");
const fs = require("fs");
const PORT = 3000;

const myServer = http.createServer((req, res) => {
  const baseUrl = "http://" + req.headers.host || "localhost";
  const fullUrl = new URL(req.url, baseUrl);
  switch (fullUrl.pathname) {
    case "/":
      const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
      fs.appendFile("server.log", logEntry, (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        } else {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("Welcome to the Home Page!");
        }
      });

      break;
    case "/about":
      const logEntry2 = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
      fs.appendFile("server.log", logEntry2, (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        } else {
          res.writeHead(200, { "Content-Type": "text/plain" });
        }
      });

      break;
    case "/contact":
      const logEntry3 = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
      fs.appendFile("server.log", logEntry3, (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        } else {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("This is the Contact Page.");
        }
      });

      break;
    default:
      const logEntry4 = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
      fs.appendFile("server.log", logEntry4, (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        }
      });
  }
});

myServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
