const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 4173;
const root = __dirname;
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".rules": "text/plain; charset=utf-8",
};

http
  .createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://127.0.0.1:${port}`);
    const pathname = decodeURIComponent(requestUrl.pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const requestedFile = path.resolve(root, relativePath);
    const relativeToRoot = path.relative(root, requestedFile);

    if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    fs.readFile(requestedFile, (error, content) => {
      if (error) {
        const fallback = path.join(root, "404.html");
        fs.readFile(fallback, (fallbackError, fallbackContent) => {
          if (fallbackError) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not found");
            return;
          }

          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(fallbackContent);
        });
        return;
      }

      const extension = path.extname(requestedFile).toLowerCase();
      res.writeHead(200, { "Content-Type": contentTypes[extension] || "application/octet-stream" });
      res.end(content);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`SquadLink preview running at http://localhost:${port}`);
  });
