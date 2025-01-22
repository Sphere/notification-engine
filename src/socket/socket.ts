import { Server, Socket } from 'socket.io';
import { markAsRead, getNotifications, markAllAsRead } from '../services/notification.service';
import { logger } from '../utils/logger';

const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        // Mark notification as read
        socket.on('markAsRead', async (data: { notificationId: string, userId: string }) => {
            try {
                logger.info('Marking notification as read event triggered');
                await markAsRead(data.notificationId, data.userId);
                socket.emit('readConfirmation', { notificationIds: data.notificationId });
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        });
        //Mark all notifications as read
        socket.on('markAllAsRead', async (data: { userId: string }) => {
            try {
                logger.info('Marking all notification as read triggered');
                await markAllAsRead(data.userId);
                socket.emit('readConfirmation', { userId: data.userId });
            } catch (error) {
                console.error('Error marking all notifications as read:', error);
            }
        });
        socket.on('getNotifications', async (data: { userId: string }) => {
            try {
                logger.info('Get notifications event triggered');
                const unreadNotificationsData = await getNotifications(data.userId);
                socket.emit('notificationsData', { notificationData: unreadNotificationsData });
            } catch (error) {
                console.error('Error getting all notifications', error);
            }
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export { setupSocket };
