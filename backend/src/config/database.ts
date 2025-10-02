import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'dating_app_db',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool: sql.ConnectionPool | null = null;

export const connectDB = async (): Promise<sql.ConnectionPool> => {
    try {
        if (pool) {
            return pool;
        }

        pool = await sql.connect(config);
        console.log('✅ Database connected successfully');
        return pool;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};

export const getDB = (): sql.ConnectionPool => {
    if (!pool) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return pool;
};

export const closeDB = async (): Promise<void> => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('Database connection closed');
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
};

export default sql;