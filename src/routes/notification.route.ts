import express from 'express';
import * as notificationController from '../controllers/notification.controller';

const router = express.Router();

router.post('/notifications', notificationController.createNotification);
router.get('/notifications/:userid', notificationController.getUserNotifications);
router.put('/notifications/read/:id', notificationController.markNotificationAsRead);

export default router;
