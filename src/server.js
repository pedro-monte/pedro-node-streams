import http from 'http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('application/json')) {
    await json(req, res);
  }

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;
    req.query = query ? extractQueryParams(query) : {};
    req.params = params;

    return route.handler(req, res);
  }

  return res.writeHead(201).end();
});

server.listen(3333);
