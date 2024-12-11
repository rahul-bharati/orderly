import mongoose, {Schema} from "mongoose";

export interface IProject {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
  collaborators: Schema.Types.ObjectId[];
  owner: Schema.Types.ObjectId;
  isActive?: boolean;
}

const ProjectSchema = new Schema<IProject>({
  name: {type: String, required: true},
  description: {type: String, required: true},
  collaborators: [{type: Schema.Types.ObjectId, ref: "User"}],
  owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
  isActive: {type: Boolean, default: true},
}, {
  timestamps: true,
});

export default mongoose.model<IProject>("Project", ProjectSchema);