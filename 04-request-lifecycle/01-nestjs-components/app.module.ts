import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { ApiVersionInterceptor } from "./interceptors/api-version.interceptor";
import { LoggingMiddleware } from "./middlewares/logging.middleware";

@Module({
  imports: [TasksModule],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ApiVersionInterceptor,
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}
