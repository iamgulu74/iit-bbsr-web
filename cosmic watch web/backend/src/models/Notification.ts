import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'approaching_asteroid' | 'new_hazardous' | 'watchlist_update';
    title: string;
    message: string;
    neoId?: string;
    asteroidId?: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['approaching_asteroid', 'new_hazardous', 'watchlist_update'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    neoId: { type: String },
    asteroidId: { type: Schema.Types.ObjectId, ref: 'Asteroid' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
