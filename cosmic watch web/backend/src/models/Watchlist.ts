import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlist extends Document {
    user: mongoose.Types.ObjectId;
    asteroid: mongoose.Types.ObjectId; // Reference to our local Asteroid model
    alertThreshold: number; // in AU
    alertsEnabled: boolean;
    addedAt: Date;
}

const WatchlistSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    asteroid: { type: Schema.Types.ObjectId, ref: 'Asteroid', required: true },
    alertThreshold: { type: Number, default: 0.05 }, // Default 0.05 AU
    alertsEnabled: { type: Boolean, default: true },
    addedAt: { type: Date, default: Date.now }
});

// Ensure a user can't add the same asteroid twice
WatchlistSchema.index({ user: 1, asteroid: 1 }, { unique: true });

export default mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
