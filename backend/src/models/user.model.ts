import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  CUSTOMER = 'customer',
  STUDIO = 'studio',
  ADMIN = 'admin',
}

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NONE = 'NONE',
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  firebaseUid?: string;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  role: UserRole;
  kycStatus: KycStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUser> {
  findOrCreateFromFirebase(firebaseUser: any): Promise<IUser>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    fullName: {
      type: String,
      required: function (this: IUser) {
        return !this.firebaseUid;
      },
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.firebaseUid;
      },
      minlength: 6,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    passwordResetToken: {
      type: String,
      default: null,
      index: true,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      required: true,
    },
    kycStatus: {
      type: String,
      enum: Object.values(KycStatus),
      default: KycStatus.NONE,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// Hide sensitive fields when returning JSON
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});

// Find or create user from Firebase
userSchema.statics.findOrCreateFromFirebase = async function (
  firebaseUser: any
): Promise<IUser> {
  let user = await this.findOne({ firebaseUid: firebaseUser.uid });

  if (!user) {
    user = await this.create({
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: firebaseUser.displayName || '',
      phone: firebaseUser.phoneNumber || '',
      role: UserRole.CUSTOMER,
      kycStatus: KycStatus.NONE,
      isActive: true,
    });
  }

  return user;
};

const User =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;