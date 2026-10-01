import { Controller, Get, Header, Module } from '@nestjs/common';

@Controller('health')
class HealthController {
  @Get()
  @Header('Cache-Control', 'no-store')
  health() {
    // Liveness only. Dependency readiness is added with persistence and queues.
    return { service: 'api', status: 'ok', scope: 'process' };
  }
}

@Module({ controllers: [HealthController] })
export class AppModule {}
