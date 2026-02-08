import express from 'express';
import * as notificationController from '../controllers/notification.controller';

const router = express.Router();

router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);

export default router;
