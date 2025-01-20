import { Server, Socket } from 'socket.io';
import { markAsRead, getNotificationCount } from '../services/notification.service';
import { logger } from '../utils/logger';

const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Mark notification as read
        socket.on('markAsRead', async (data: { notificationIds: string[] }) => {
            try {
                logger.info('Marking notification as read triggered');
                await markAsRead(data.notificationIds);
                socket.emit('readConfirmation', { notificationIds: data.notificationIds });
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        });
        socket.on('getNotificationCount', async (data: { userId: string }) => {
            try {
                logger.info('Get notification count triggered');
                const unreadCount = await getNotificationCount(data.userId);
                socket.emit('notificationCountValue', { count: unreadCount });
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export { setupSocket };
