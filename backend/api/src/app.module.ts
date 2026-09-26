import { Controller, Get, Module } from '@nestjs/common';

@Controller('health')
class HealthController {
  @Get()
  health() {
    // Liveness only. Dependency readiness is added with persistence and queues.
    return { service: 'api', status: 'ok', scope: 'process' };
  }
}

@Module({ controllers: [HealthController] })
export class AppModule {}
