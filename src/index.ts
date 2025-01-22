require('dotenv').config();
import express from 'express';
import cors from 'cors';
import notificationRoutes from './routes/notification.route';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket/socket';  // Your socket setup
import { logger } from "./utils/logger";

const applicationPort= process.env.APPLICATION_PORT || "3013"
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST'],
    },
});

export const attachIo = (io: Server) => {
    return (req: any, res: any, next: any) => {
        req.io = io;  // Attach io instance to req
        next();        // Continue to the next middleware or route handler
    };
};

app.use((req, _res, next) => {
    logger.info(`Requested Route: ${req.method} ${req.url}`);
    next();
}); 
app.use(attachIo(io));
app.use(cors());
app.use(express.json());
app.use('/v1', notificationRoutes);
setupSocket(io);

httpServer.listen(applicationPort, () => {
    console.log(`Server running at http://localhost:${applicationPort}`);
});
export default app;
