import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const notifications = await notificationService.getNotifications(limit);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await notificationService.markAsRead(id);
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read' });
    }
};
