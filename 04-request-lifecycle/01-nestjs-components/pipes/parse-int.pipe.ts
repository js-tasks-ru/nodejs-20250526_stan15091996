import { BadRequestException, PipeTransform } from "@nestjs/common";

export class CustomParseIntPipe implements PipeTransform {
  transform(value: string): number {
    if (isNaN(Number(value))) {
      throw new BadRequestException(`"${value}" не является числом`);
    } else {
      return Number(value);
    }
  }
}
