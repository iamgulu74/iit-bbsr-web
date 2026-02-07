import Notification, { INotification } from '../models/Notification';
import Asteroid from '../models/Asteroid';
import User from '../models/User';
import cron from 'node-cron';
import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const createNotification = async (
    userId: string,
    type: 'approaching_asteroid' | 'new_hazardous' | 'watchlist_update',
    title: string,
    message: string,
    neoId?: string,
    asteroidId?: string
) => {
    try {
        const notification = new Notification({
            userId,
            type,
            title,
            message,
            neoId,
            asteroidId
        });
        await notification.save();

        // Broadcast real-time notification if socket io is initialized
        if (ioInstance) {
            ioInstance.emit(`notification-${userId}`, {
                _id: notification._id,
                type,
                title,
                message,
                neoId,
                asteroidId,
                createdAt: notification.createdAt,
                isRead: false
            });
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

const sendEmailMock = (to: string, subject: string, body: string) => {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
};

const sendSMSMock = (to: string, message: string) => {
    console.log(`[MOCK SMS] To: ${to} | Message: ${message}`);
};

export const getNotifications = async (limit: number = 5) => {
    try {
        return await Notification.find().sort({ createdAt: -1 }).limit(limit).populate('asteroidId', 'name nasaId');
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const markAsRead = async (id: string) => {
    try {
        return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};

// Cron Job: Check for dangerous approaches in the next 24 hours
export const initNotificationService = (io?: SocketIOServer) => {
    console.log('Initializing Notification Service...');
    if (io) ioInstance = io;

    // Run every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled asteroid risk check...');
        const today = new Date();
        const maxCheckDate = new Date(today);
        maxCheckDate.setDate(maxCheckDate.getDate() + 14); // Check up to 14 days ahead as per settings

        try {
            const users = await User.find({});
            const approachingAsteroids = await Asteroid.find({
                'closeApproachData.date': { $gte: today, $lte: maxCheckDate }
            });

            for (const user of users) {
                const settings = user.alertSettings || {
                    daysBeforeApproach: [7, 3, 1],
                    minRiskLevel: 'medium',
                    notifyAll: false,
                    notifyWatchedOnly: true,
                    emailEnabled: false,
                    smsEnabled: false
                };

                for (const asteroid of approachingAsteroids) {
                    const approach = asteroid.closeApproachData.find(ca => ca.date >= today && ca.date <= maxCheckDate);
                    if (!approach) continue;

                    const daysToApproach = Math.ceil((approach.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                    // Check if we should notify this user for this asteroid
                    const shouldNotify = settings.daysBeforeApproach.includes(daysToApproach) &&
                        (asteroid.riskLevel === settings.minRiskLevel ||
                            (settings.minRiskLevel === 'low') ||
                            (settings.minRiskLevel === 'medium' && ['medium', 'high', 'critical'].includes(asteroid.riskLevel)) ||
                            (settings.minRiskLevel === 'high' && ['high', 'critical'].includes(asteroid.riskLevel)) ||
                            (settings.minRiskLevel === 'critical' && asteroid.riskLevel === 'critical'));

                    if (shouldNotify) {
                        await createNotification(
                            user._id.toString(),
                            'approaching_asteroid',
                            'Approaching Asteroid',
                            `${asteroid.name} is approaching in ${daysToApproach} days. Risk: ${asteroid.riskLevel.toUpperCase()}`,
                            asteroid.nasaId,
                            asteroid._id.toString()
                        );

                        // Trigger Email/SMS if enabled
                        if (user.alertSettings?.emailEnabled) {
                            sendEmailMock(user.email, 'Asteroid Alert', `${asteroid.name} is approaching. Risk Level: ${asteroid.riskLevel}`);
                        }
                        if (user.alertSettings?.smsEnabled) {
                            sendSMSMock(user.email, `${asteroid.name} alert! Risk: ${asteroid.riskLevel}`); // Using email as mock phone
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in scheduled risk check:', error);
        }
    });
};
