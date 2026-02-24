const http = require("http");
const fs = require("fs");
const path = require("path");
const { dbConnection } = require("./dbConnection");
const { ObjectId } = require("mongodb");
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
        } else if (req.url.startsWith("/fetchData")) {
          const data = await book.find({}).toArray();
          if (data) {
            res.writeHead(200, { "Content-type": "application/json" });
            res.end(JSON.stringify(data));
          } else {
            res.writeHead(400, { "Content-type": "application/json" });
            res.end(JSON.stringify({ message: "no data found" }));
          }
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
      } else if (req.method === "PUT" && req.url.startsWith('/update')) {
       let data=''
       req.on("data", (chunk) => {
        data += chunk.toString();  
      
      });
      req.on('end',async()=>{
      const parsedData=JSON.parse(data)
      const{editIndex,formEntries:{moviename,category,rating}}=parsedData
     // console.log(editIndex,moviename,category,rating)
       const result=await book.updateOne({_id:new ObjectId(editIndex)},{$set:{moviename,category,rating}})
       if (result.acknowledged) {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Book Updated" }));
      }else{
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(JSON.stringify({ message: "student not updated" }));
      }
      })
      
      } else if (req.method === "DELETE" && req.url.startsWith("/delete")) {
        let id = "";
        req.on("data", (chunk) => {

          id += chunk.toString();
        });
        req.on("end", async () => {
          const parsedId = JSON.parse(id);
          const result = await book.deleteOne({ _id: new ObjectId(parsedId._id) });
          if (result.acknowledged) {
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Book removed" }));
          }else{
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end(JSON.stringify({ message: "student not deleted" }));
          }
        });
      }
    })
    .listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
    });
};

startServer();
