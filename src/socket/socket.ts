import { Server, Socket } from 'socket.io';
import { markAsRead } from '../services/notification.service';

const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Mark notification as read
    socket.on('markAsRead', async (data: { userId: string; notificationId: string }) => {
      try {
        await markAsRead(data.notificationId);
        socket.emit('readConfirmation', { notificationId: data.notificationId });
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
