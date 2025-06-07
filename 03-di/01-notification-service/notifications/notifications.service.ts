import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { INotificationsOption } from "./notifications.model";
import { readFileSync,  writeFileSync} from "node:fs";
import { json } from "node:stream/consumers";

@Injectable()
export class NotificationsService {
  constructor(@Inject('NOTIFICATION_OPTIONS') private readonly options: INotificationsOption){}
  sendEmail(to: string, subject: string, message: string) {
    if (!to || !subject || !message) throw new BadRequestException('Некорректные данные для отправки E-mail');

    console.log(this.options.senderEmail);
    const log = `Email sent to ${to}: ${subject} Вы назначены ответственным за задачу: "${message}"`;
    console.log(log)
    this.writeLogs(log);
  }

  sendSMS(to: string, message: string) {
    if (!to || !message) throw new BadRequestException('Некорректные данные для отправки SMS');
    console.log(this.options.smsGateway);
    console.log(`SMS sent to ${to}: ${message}`)
    this.writeLogs('');
  }

  private writeLogs(log: string) {
    const logs = JSON.parse(readFileSync('./notifications/logs.json', 'utf-8'));
    logs.logs.push(log);
    writeFileSync('./notifications/logs.json', JSON.stringify(logs));
  }
}
