import mongoose, {Schema} from "mongoose";

export interface IRefreshToken {
  _id: string;
  token: string;
  userId: Schema.Types.ObjectId;
  expires: Date;
  createdByIp: string;
  revoked?: Date;
  revokedByIp?: string;
  replacedByToken?: string;
  replacedByTokenIp?: string;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: {type: String, required: true},
  userId: {type: Schema.Types.ObjectId, ref: "users", required: true},
  expires: {type: Date, required: true},
  createdByIp: {type: String, required: true},
  revoked: {type: Date},
  revokedByIp: {type: String},
  replacedByToken: {type: String},
  replacedByTokenIp: {type: String},
});

export default mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);