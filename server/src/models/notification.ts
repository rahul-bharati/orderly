import mongoose, {Schema} from "mongoose";

export interface INotification {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  project: Schema.Types.ObjectId;
  task: Schema.Types.ObjectId;
  type: string;
  message: string;
  isRead: boolean;
}

const NotificationSchema = new Schema<INotification>({
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  project: {type: Schema.Types.ObjectId, ref: "Project"},
  task: {type: Schema.Types.ObjectId, ref: "Task"},
  type: {
    type: String,
    required: true,
    enum: ["comment", "assignment", "status", "priority", "tag", "link", "file", "due-date", "reminder", "create", "update", "delete"]
  },
  message: {type: String, required: true},
  isRead: {type: Boolean, default: false},
}, {
  timestamps: true,
});

export default mongoose.model<INotification>("Notification", NotificationSchema);