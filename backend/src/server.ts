import app from './app';
import { connectDB, closeDB } from './config/database';

const PORT = process.env.PORT || 5000;

let server: any;

const startServer = async () => {
    try {
        // Connect to database first
        await connectDB();
        console.log('✅ Database connected successfully');

        // Start Express server
        server = app.listen(PORT, () => {
            console.log(`
========================================
🚀 Server is running!
========================================
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 URL: http://localhost:${PORT}
⚡ Health Check: http://localhost:${PORT}/health
========================================
      `);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
const shutdown = async () => {
    console.log('\n👋 Shutting down gracefully...');

    try {
        if (server) {
            await new Promise((resolve) => {
                server.close(resolve);
            });
            console.log('✅ HTTP server closed');
        }

        await closeDB();
        console.log('✅ Database connection closed');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    shutdown();
});

// Handle SIGTERM
process.on('SIGTERM', shutdown);

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', shutdown);

// Start the server
startServer();