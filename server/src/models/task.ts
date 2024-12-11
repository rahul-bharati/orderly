import mongoose, {Schema} from "mongoose";

export interface ITask {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
  project: Schema.Types.ObjectId;
  assignee: Schema.Types.ObjectId;
  creator: Schema.Types.ObjectId;
  assignedBy: Schema.Types.ObjectId;
  assignedAt: Date;
  status: string;
  priority: string;
  tags: string[];
  links: string[];
  files: string[];
  dueDate: Date;
  reminder: Date;
  remind: boolean;
}

const TaskSchema = new Schema<ITask>({
  name: {type: String, required: true},
  description: {type: String, required: true},
  project: {type: Schema.Types.ObjectId, ref: "Project", required: true},
  assignee: {type: Schema.Types.ObjectId, ref: "User"},
  creator: {type: Schema.Types.ObjectId, ref: "User", required: true},
  assignedBy: {type: Schema.Types.ObjectId, ref: "User"},
  assignedAt: {type: Date},
  status: {type: String, required: true, enum: ["todo", "in-progress", "done"]},
  priority: {type: String, required: true, enum: ["lowest", "low", "medium", "high", "highest"]},
  tags: [{type: String}],
  links: [{type: String}],
  files: [{type: String}],
  dueDate: {type: Date},
  reminder: {type: Date},
  remind: {type: Boolean, default: false},
}, {
  timestamps: true,
});

export default mongoose.model<ITask>("Task", TaskSchema);