import http from "http";
import { json } from "./middlewares/json.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  await json(req, res);

  if (method === "POST" && url === "/users" && req.body) {
    const { name, body } = req.body;
  }

  return res.writeHead(201).end();
});

server.listen(3333);
