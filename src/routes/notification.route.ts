import express from 'express';
import * as notificationController from '../controllers/notification.controller';

const router = express.Router();

router.post('/notifications', notificationController.createNotification);
router.get('/notifications/:userid', notificationController.getUserNotifications);
router.post('/notifications/read', notificationController.markNotificationAsRead);

export default router;
