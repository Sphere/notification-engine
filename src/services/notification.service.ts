import { client } from '../config/cassandra';
import { Server } from 'socket.io';

// Create a notification
export const createNotification = async (newNotification: any, io: Server) => {
    const query = `
      INSERT INTO user_notifications (
        id, userid, category, createdby, createdon, data, expireon, priority, status, updatedby, updatedon
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const {
        id = uuidv4(), // Generate unique UUID if not provided
        userid,
        category,
        createdby,
        createdon,
        data,
        expireon,
        priority,
        status = 'unread', // Default status is 'unread'
        updatedby,
        updatedon,
    } = newNotification;

    await client.execute(query, [
        id,
        userid,
        category,
        createdby,
        createdon,
        data,
        expireon ? new Date(expireon) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default expiry: 7 days
        priority,
        status,
        updatedby,
        updatedon,
    ], { prepare: true });
    io.emit('notificationCountUpdated', { userid, count: await getNotificationCount(userid) });

};
export const getNotificationCount = async (userid: String) => {
    const query = 'SELECT COUNT(*) FROM user_notifications WHERE userid = ? AND status = ? ALLOW FILTERING;';
    const result = await client.execute(query, [userid, "unread"], { prepare: true });
    return result.rows[0].count || 0;
};
// Get notifications for a user
export const getNotifications = async (userId: string) => {
    const query = `
    SELECT *
    FROM user_notifications
    WHERE userid = ? AND status = 'unread' ALLOW FILTERING
  `;
    const result = await client.execute(query, [userId], { prepare: true });
    return result.rows;
};

// Mark a notification as read
export const markAsRead = async (notificationId: string) => {
    const query = `
    UPDATE user_notifications
    SET status = 'read' 
    WHERE  id = ?;
  `;

    await client.execute(query, [notificationId], { prepare: true });
}
export const markAllAsRead = async (userId: string) => {
    const getAllUnreadNotifications = await getNotifications(userId);
    const batchQueries = getAllUnreadNotifications.map((notification) => ({
        query: 'UPDATE user_notifications SET status = ? WHERE id = ?;',
        params: ['read', notification.id],
    }));
    await client.batch(batchQueries, { prepare: true })
}
function uuidv4() {
    throw new Error('Function not implemented.');
}

