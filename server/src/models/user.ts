import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
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