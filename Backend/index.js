const http = require("http");
const fs = require("fs");
const path = require("path");
const {dbConnection}=require('./dbConnection')
const PORT = 8000;

const startServer=async()=>{
const db=await dbConnection()
const student=db.collection('books')
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
          const jsPage = path.join(__dirname, "Public", "index.html");
          fs.readFile(jsPage, (err, data) => {
            if (err) {
              console.log(err);
              res.writeHead(500, { "Content-type": "text/plain" });
              res.end();
            } else res.writeHead(200, { "Content-type": "application/js" });
            res.end(data);
            
          });
        }
      } else if (req.method === "POST") {
      } else if (req.method === "PUT") {
      } else if (req.method === "DELETE") {
      }
    })
    .listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
    });
}

startServer()
