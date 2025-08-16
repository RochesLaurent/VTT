// websocket-server/src/health.ts
import express from 'express';

export function setupHealthEndpoint(app: express.Application): void {
    // Endpoint de santé pour les health checks Docker
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'websocket-server',
            version: '1.0.0',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development'
        });
    });

    // Endpoint de statut plus détaillé
    app.get('/status', (req, res) => {
        res.status(200).json({
            status: 'operational',
            timestamp: new Date().toISOString(),
            service: 'websocket-server',
            redis: {
                connected: true,
                host: process.env.REDIS_HOST || 'redis',
                port: process.env.REDIS_PORT || 6379
            },
            websocket: {
                enabled: true,
                cors_origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
            },
            backend: {
                url: process.env.BACKEND_URL || 'http://backend:8000',
                api_url: process.env.BACKEND_API_URL || 'http://backend:8000/api'
            },
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            pid: process.pid
        });
    });
}
