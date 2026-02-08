import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    displayName?: string;
    createdAt: Date;
    updatedAt: Date;
    preferences: {
        emailNotifications: boolean;
        darkMode: boolean;
    };
    alertSettings: {
        daysBeforeApproach: number[];
        minRiskLevel: 'low' | 'medium' | 'high' | 'critical';
        notifyAll: boolean;
        notifyWatchedOnly: boolean;
        emailEnabled: boolean;
        smsEnabled: boolean;
    };
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String },
    preferences: {
        emailNotifications: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: true }
    },
    alertSettings: {
        daysBeforeApproach: { type: [Number], default: [7, 3, 1] },
        minRiskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
        notifyAll: { type: Boolean, default: false },
        notifyWatchedOnly: { type: Boolean, default: true },
        emailEnabled: { type: Boolean, default: false },
        smsEnabled: { type: Boolean, default: false }
    }
}, { timestamps: true });

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
