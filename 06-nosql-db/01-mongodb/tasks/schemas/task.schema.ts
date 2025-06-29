import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TaskDocument = HydratedDocument<Task>;

export enum Priority  {
  low = 'low',
  medium = 'medium',
  urgent = 'urgent',
}

@Schema()
export class Task {
  @Prop({required: true, unique: true})
  title: string;

  @Prop()
  description: string;

  @Prop({default: false})
  isCompleted: boolean;

  @Prop()
  priority: Priority;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
