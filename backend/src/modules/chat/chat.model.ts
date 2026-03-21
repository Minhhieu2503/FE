import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
  customerId: Types.ObjectId;
  studioId: Types.ObjectId;
  lastMessage: string;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessage: {
      type: String,
      default: '',
      trim: true,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'conversations',
  }
);

conversationSchema.index({ customerId: 1, studioId: 1 }, { unique: true });

const Conversation = mongoose.model<IConversation>(
  'Conversation',
  conversationSchema
);

export default Conversation;