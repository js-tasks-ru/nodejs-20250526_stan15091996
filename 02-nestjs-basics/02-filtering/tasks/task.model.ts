import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsPositive, Min, IsNumber } from 'class-validator';

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export class QueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
  @IsOptional()
  page?: number;
  @IsOptional()
  limit?: number;
  @IsOptional()
  sortBy?: keyof Task;
}