import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from "@nestjs/terminus";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: "Check application health" })
  @ApiResponse({ status: 200, description: "Health check successful" })
  @ApiResponse({ status: 503, description: "Service unavailable" })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck("database"),
      () => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024),
      () => this.memory.checkRSS("memory_rss", 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage("storage", { path: "/", thresholdPercent: 0.9 }),
    ]);
  }

  @Get("simple")
  @ApiOperation({ summary: "Simple health check" })
  @ApiResponse({ status: 200, description: "Service is up" })
  simple() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
