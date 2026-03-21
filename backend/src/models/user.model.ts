import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STUDIO = 'STUDIO',
  ADMIN = 'ADMIN',
}

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NONE = 'NONE',
}

export interface IUser extends Document {
  email: string;
  password?: string;
  firebaseUid?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: UserRole;
  kycStatus: KycStatus;
  isActive: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUser> {
  findOrCreateFromFirebase(firebaseUser: any): Promise<IUser>;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function(this: any) {
        return !this.firebaseUid;
      },
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
  }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Exclude password from query results by default, unless explicitly requested (e.g. for login)
// Actually we can handle this in service layer, or rewrite toJSON.
userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});

// Static method for Firebase login
userSchema.statics.findOrCreateFromFirebase = async function (firebaseUser: any): Promise<IUser> {
  let user = await this.findOne({ firebaseUid: firebaseUser.uid });

  if (!user) {
    user = new this({
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      role: UserRole.CUSTOMER, // Default role
    });
    await user.save();
  }

  return user;
};

const User = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;
