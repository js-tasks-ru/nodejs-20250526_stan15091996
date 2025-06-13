import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const role: string = context.switchToHttp().getRequest().headers['x-role'];

    if (role === 'admin') {
      return true;
    } else {
      throw new ForbiddenException('Доступ запрещён: требуется роль admin')
    }
  };
}
