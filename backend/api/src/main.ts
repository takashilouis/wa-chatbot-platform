import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = Number(process.env.API_PORT ?? 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('API_PORT must be a valid TCP port');
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(port, process.env.API_HOST || '127.0.0.1');
}

void bootstrap().catch(() => {
  console.error('API startup failed. Check local configuration and port availability.');
  process.exitCode = 1;
});
