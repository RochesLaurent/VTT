import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId: string;
  username: string;
}

declare module 'socket.io' {
  interface Socket {
    userId?: string;
    username?: string;
  }
}

dotenv.config();

const app = express();
const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
  
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    socket.userId = (decoded as any).userId;
    socket.username = (decoded as any).username;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  if (!socket.userId || !socket.username) {
    console.error('Socket connected without proper authentication');
    socket.disconnect();
    return;
  }

  console.log(`User connected: ${socket.username} (${socket.userId})`);

  socket.on('joinGame', async (gameId: string) => {
    if (!socket.userId || !socket.username) return;

    await socket.join(`game_${gameId}`);
    
    await redisClient.hSet(`game_${gameId}_players`, socket.userId, JSON.stringify({
      socketId: socket.id,
      username: socket.username,
      joinedAt: new Date().toISOString()
    }));

    socket.to(`game_${gameId}`).emit('playerJoined', {
      userId: socket.userId,
      username: socket.username
    });

    console.log(`${socket.username} joined game ${gameId}`);
  });

  socket.on('leaveGame', async (gameId: string) => {
    if (!socket.userId || !socket.username) return;

    await socket.leave(`game_${gameId}`);
    
    await redisClient.hDel(`game_${gameId}_players`, socket.userId);

    socket.to(`game_${gameId}`).emit('playerLeft', {
      userId: socket.userId,
      username: socket.username
    });

    console.log(`${socket.username} left game ${gameId}`);
  });

  socket.on('chatMessage', async (data: { gameId: string; message: string; type?: string }) => {
    if (!socket.userId || !socket.username) return;

    const messageData = {
      id: Date.now().toString(),
      userId: socket.userId,
      username: socket.username,
      message: data.message,
      type: data.type || 'text',
      timestamp: new Date().toISOString()
    };

    await redisClient.lPush(`game_${data.gameId}_chat`, JSON.stringify(messageData));
    await redisClient.lTrim(`game_${data.gameId}_chat`, 0, 99);

    io.to(`game_${data.gameId}`).emit('chatMessage', messageData);
  });

  socket.on('rollDice', async (data: { gameId: string; diceType: string; modifier?: number }) => {
    if (!socket.userId || !socket.username) return;

    const sides = parseInt(data.diceType.replace('d', ''));
    const roll = Math.floor(Math.random() * sides) + 1;
    const total = roll + (data.modifier || 0);

    const rollData = {
      id: Date.now().toString(),
      userId: socket.userId,
      username: socket.username,
      diceType: data.diceType,
      roll: roll,
      modifier: data.modifier || 0,
      total: total,
      timestamp: new Date().toISOString()
    };

    await redisClient.lPush(`game_${data.gameId}_rolls`, JSON.stringify(rollData));
    await redisClient.lTrim(`game_${data.gameId}_rolls`, 0, 49); // Garder les 50 derniers lancers

    io.to(`game_${data.gameId}`).emit('diceRoll', rollData);

    console.log(`🎲 ${socket.username} rolled ${data.diceType}: ${roll} (total: ${total})`);
  });

  socket.on('updateCharacter', async (data: { gameId: string; characterData: any }) => {
    if (!socket.userId || !socket.username) return;

    await redisClient.hSet(`game_${data.gameId}_characters`, socket.userId, JSON.stringify(data.characterData));

    socket.to(`game_${data.gameId}`).emit('characterUpdated', {
      userId: socket.userId,
      characterData: data.characterData
    });
  });

  socket.on('disconnect', async () => {
    if (!socket.userId || !socket.username) return;

    console.log(`User disconnected: ${socket.username}`);

    const keys = await redisClient.keys('game_*_players');
    for (const key of keys) {
      const gameId = key.match(/game_(.+)_players/)?.[1];
      if (gameId) {
        await redisClient.hDel(key, socket.userId);
        
        socket.to(`game_${gameId}`).emit('playerLeft', {
          userId: socket.userId,
          username: socket.username
        });
      }
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount 
  });
});

const PORT = process.env.PORT || 3001;

redisClient.connect().then(() => {
  server.listen(PORT, () => {
    console.log(`WebSocket Server running on port ${PORT}`);
    console.log(`Accepting connections from: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  });
}).catch((err) => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1);
});