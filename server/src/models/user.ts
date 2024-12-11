import mongoose from "mongoose";

const {Schema} = mongoose;

export interface IUser {
  _id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  jobTitle?: string;
  profilePicture?: string;
  isActive?: boolean;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  jobTitle: String,
  profilePicture: String,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  }
});

export default mongoose.model("User", userSchema);