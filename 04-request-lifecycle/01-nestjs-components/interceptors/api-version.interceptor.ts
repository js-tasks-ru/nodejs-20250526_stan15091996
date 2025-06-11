import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { tap, map } from "rxjs";

export class ApiVersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const currentDate = new Date();

    return next.handle().pipe(
      map((data) => {
        return {
          ...data,
          apiVersion: "1.0",
          executionTime: Number(new Date()) - Number(currentDate)
        };
      }),
    );
  }
}
