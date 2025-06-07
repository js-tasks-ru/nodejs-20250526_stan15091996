import { DynamicModule, Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { UsersModule } from "users/users.module";
import { INotificationsOption } from "./notifications.model";

@Module({})
export class NotificationsModule {
  static forRoot(options: INotificationsOption): DynamicModule {
    return {
      module: NotificationsModule,
      imports: [UsersModule],
      providers: [
        {
          provide: 'NOTIFICATION_OPTIONS',
          useValue: options,
        },
        NotificationsService
      ],
      exports: [NotificationsService],
    }
  }
}
