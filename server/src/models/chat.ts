import mongoose, {Schema} from "mongoose";

export interface IChat {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  project: Schema.Types.ObjectId;
  message: string;
  sentTo: Schema.Types.ObjectId;
  isRead: boolean;
}

const ChatSchema = new Schema<IChat>({
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  project: {type: Schema.Types.ObjectId, ref: "Project", required: true},
  message: {type: String, required: true},
  sentTo: {type: Schema.Types.ObjectId, ref: "User"},
  isRead: {type: Boolean, default: false},
}, {
  timestamps: true,
});

export default mongoose.model<IChat>("Chat", ChatSchema);