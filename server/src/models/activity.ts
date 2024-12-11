import mongoose, {Schema} from "mongoose";

export interface IActivity {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  project: Schema.Types.ObjectId;
  task: Schema.Types.ObjectId;
  type: string;
  content: string;
  assignmentTo?: Schema.Types.ObjectId;
}

const ActivitySchema = new Schema<IActivity>({
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  project: {type: Schema.Types.ObjectId, ref: "Project"},
  task: {type: Schema.Types.ObjectId, ref: "Task"},
  type: {
    type: String,
    required: true,
    enum: ["comment", "assignment", "status", "priority", "tag", "link", "file", "due-date", "reminder", "create", "update", "delete"]
  },
  content: {type: String, required: true},
  assignmentTo: {type: Schema.Types.ObjectId, ref: "User"},
}, {
  timestamps: true,
});

export default mongoose.model<IActivity>("Activity", ActivitySchema);