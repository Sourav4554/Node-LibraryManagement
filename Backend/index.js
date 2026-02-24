const http = require("http");
const fs = require("fs");
const path = require("path");
const { dbConnection } = require("./dbConnection");
const PORT = 8000;

const startServer = async () => {
  const db = await dbConnection();
  const book = db.collection("books");
  http
    .createServer(async (req, res) => {
      if (req.method === "GET") {
        //  render html
        if (req.url === "/") {
          const htmlPage = path.join(__dirname, "Public", "index.html");
          fs.readFile(htmlPage, (err, data) => {
            if (err) {
              console.log(err);
              res.writeHead(500, { "Content-type": "text/plain" });
              res.end();
            } else res.writeHead(200, { "Content-type": "text/html" });
            res.end(data);
          });
        }
        //render css
        else if (req.url === "/style.css") {
          const cssPage = path.join(__dirname, "Public", "style.css");
          fs.readFile(cssPage, (err, data) => {
            if (err) {
              console.log(err);
              res.writeHead(500, { "Content-type": "text/plain" });
              res.end();
            } else res.writeHead(200, { "Content-type": "text/css" });
            res.end(data);
          });
        } else if (req.url === "/script.js") {
          const jsPage = path.join(__dirname, "Public", "script.js");

          fs.readFile(jsPage, (err, data) => {
            if (err) {
              console.log(err);
              res.writeHead(500, { "Content-type": "text/plain" });
              res.end();
            } else
              res.writeHead(200, { "Content-type": "application/javascript" });
            res.end(data);
          });
        }
      } else if (req.method === "POST" && req.url.startsWith("/submit")) {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk.toString();
        });
        req.on("end", async () => {
          const parsedData = JSON.parse(data);

          book.insertOne(parsedData);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Student added" }));
        });
      } else if (req.method === "PUT") {
      } else if (req.method === "DELETE") {
      }
    })
    .listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
    });
};

startServer();
