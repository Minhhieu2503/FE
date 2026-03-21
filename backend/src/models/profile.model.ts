import mongoose, { Document, Schema } from 'mongoose';

export interface IPackage {
  name: string;
  price: number;
  description: string;
  deliveryDays: number;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  avatar?: string;
  bio?: string;
  packages?: IPackage[];
  avgRating: number;
}

const profileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: null },
    bio: { type: String, default: null },
    packages: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        deliveryDays: { type: Number, required: true },
      },
    ],
    avgRating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model<IProfile>('Profile', profileSchema);
export default Profile;
