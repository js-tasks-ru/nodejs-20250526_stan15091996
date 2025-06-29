import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Priority } from "../../tasks/schemas/task.schema";

export class CreateTaskDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(Priority)
  @IsNotEmpty()
  priority: Priority;
}
