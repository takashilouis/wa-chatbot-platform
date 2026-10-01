import { createServer } from 'node:http';

// Process skeleton only. BullMQ consumers arrive in the durable-processing task.
const port = Number(process.env.WORKER_PORT ?? 3002);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('WORKER_PORT must be a valid TCP port.');
  process.exit(1);
}

const server = createServer((request, response) => {
  if (request.method !== 'GET' || request.url?.split('?')[0] !== '/health') {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify({ service: 'worker', status: 'ok', scope: 'process' }));
});

server.on('error', () => {
  console.error('Worker startup failed. Check local configuration and port availability.');
  process.exitCode = 1;
});
server.listen(port, process.env.WORKER_HOST || '127.0.0.1', () => {
  console.log('Worker process started. Queue consumers are not configured yet.');
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => server.close());
}
