import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';
import { logger } from '../utils/logger';
// Create a new notification
export const createNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const io = req.io;
        const {
            userid,
            category,
            createdby,
            data,
            expireon,
            priority,
        } = req.body;

        const newNotification = {
            id: require('uuid').v4(),
            userid,
            category,
            createdby,
            createdon: new Date(),
            data: JSON.stringify(data),
            expireon: expireon ? new Date(expireon) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default expiry: 7 days
            priority,
            status: 'unread',
            updatedby: createdby,
            updatedon: new Date(),
        };
        logger.info(newNotification);
        await notificationService.createNotification(newNotification, io);
        res.status(201).json({ message: 'Notification created successfully', id: newNotification.id });
    } catch (error) {
        console.log(error)
        logger.info('Error creating notification:', error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

// Fetch all notifications for a user
export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userid } = req.params;
        if (!userid) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        const notifications = await notificationService.getNotifications(userid);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id,userId } = req.body;
        if (!id||!userId) {
            res.status(400).json({ error: 'Notification ID or User ID is required' });
            return;
        }
        await notificationService.markAsRead(id,userId);
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};
export const markAllNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        await notificationService.markAllAsRead(userId);
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};


