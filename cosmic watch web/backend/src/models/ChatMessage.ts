import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
    asteroidId: string;
    userId: mongoose.Types.ObjectId;
    username: string;
    message: string;
    createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema({
    asteroidId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    message: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
