import { randomUUID } from 'crypto';
import { parse } from 'csv-parse';
import Database from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        const { search } = req.query;

        const tasks = database.select(
          'tasks',
          search ? { title: search, description: search } : null
        );

        return res.end(JSON.stringify(tasks));
      } catch {
        return res.writeHead(500).end();
      }
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      try {
        const contentType = req.headers['content-type'];
        if (contentType && contentType.includes('text/csv')) {
          const parser = parse({
            delimiter: ',',
            columns: true,
            skip_lines_with_error: true,
            trim: true,
          });

          const tasks = [];

          req.pipe(parser);

          for await (const record of parser) {
            const task = {
              id: randomUUID(),
              title: record.title,
              description: record.description,
              created_at: new Date().toISOString(),
              completed_at: null,
              updated_at: null,
            };
            database.insert('tasks', task);
            tasks.push(task);
          }

          return res.writeHead(201).end();
        } else {
          const { title, description } = req.body;

          const task = {
            id: randomUUID(),
            title,
            description,
            created_at: new Date().toISOString(),
            completed_at: null,
            updated_at: null,
          };

          database.insert('tasks', task);
          return res.writeHead(201).end();
        }
      } catch (e) {
        console.log(e);

        return res.writeHead(500).end();
      }
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params;

        const taskDeleted = database.delete('tasks', id);

        if (taskDeleted) {
          return res.writeHead(204).end();
        }

        res.writeHead(404).end(JSON.stringify({ message: 'Task not found.' }));
      } catch {
        return res.writeHead(500).end();
      }
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        const { title, description } = req.body;
        const tasks = database.update('tasks', id, {
          title,
          description,
          updated_at: new Date().toISOString(),
        });

        if (tasks) {
          return res.writeHead(204).end();
        }

        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found.' }));
      } catch {
        return res.writeHead(500).end();
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      try {
        const { id } = req.params;
        const tasks = database.update('tasks', id, {
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        });

        if (tasks) {
          return res.writeHead(204).end();
        }

        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found.' }));
      } catch {
        return res.writeHead(500).end();
      }
    },
  },
];
