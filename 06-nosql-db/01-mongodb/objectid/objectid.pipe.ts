import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import mongoose, { isValidObjectId, Types } from "mongoose";

@Injectable()
export class ObjectIDPipe implements PipeTransform {
  transform(value: string): string {
    const isValidObjId = mongoose.isValidObjectId(value);

    if (!isValidObjId) throw new BadRequestException('Некоррктно укзаан id задачи')

    return value;
  }
}
