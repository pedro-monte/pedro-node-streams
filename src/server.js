import http from "http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";


//query parameters: ?userId=1&name=Pedro for stateful URLs non sensible information to modify what
//the backend will return => filters, pagination, sorts. Non obligatories

//route parameters: /users/1 => to identify a resource, sensible information, obligatories

//request body: to send formularies, images, files, JSON, XML. Tough to be decrypted and 
//intercepted by third parties, not in the URL



const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  await json(req, res);


  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if(route) {
    const routeParams = req.url.match(route.path);

    const {query, ...params} = routeParams.groups;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }
  

  return res.writeHead(201).end();
});

server.listen(3333);
