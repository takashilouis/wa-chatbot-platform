export function GET() {
  return Response.json({ service: 'web', status: 'ok', scope: 'process' }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
