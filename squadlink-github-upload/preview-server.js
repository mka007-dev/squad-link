const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 4173;
const file = path.join(__dirname, "preview.html");

http
  .createServer((req, res) => {
    if (req.url !== "/" && req.url !== "/preview.html") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    fs.readFile(file, (error, html) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Unable to load preview");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`SquadLink preview running at http://localhost:${port}`);
  });
