import mongoose, {Schema} from "mongoose";

export interface IProject {
  _id: Schema.Types.ObjectId;
  name: string;
  description?: string;
  collaborators: Schema.Types.ObjectId[];
  owner: Schema.Types.ObjectId;
}

const ProjectSchema = new Schema<IProject>({
  name: {type: String, required: true},
  description: String,
  collaborators: [{
    user: {type: Schema.Types.ObjectId, ref: "User"},
    role: {type: String, enum: ["admin", "editor", "viewer"], default: "viewer"},
  }],
  owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
}, {
  timestamps: true,
});

export default mongoose.model<IProject>("Project", ProjectSchema);