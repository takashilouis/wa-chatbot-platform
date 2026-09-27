export function GET() {
  return Response.json({ service: 'web', status: 'ok', scope: 'process',
    build: process.env.NEXT_PUBLIC_BUILD_ID, environment: process.env.NEXT_PUBLIC_DEPLOY_ENV,
    authMode: process.env.NEXT_PUBLIC_AUTH_MODE === 'demo' ? 'demo' : 'unconfigured',
    backend: 'not_connected',
  }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
