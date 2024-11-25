// backend/src/config/database.ts

import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Scan } from '../entity/Scan';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'qrdecoder',
  entities: [User, Scan],
  migrations: ['src/migration/*.ts'],
  logging: true,
});

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Add this initialization function
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('PostgreSQL connected');

    await redisClient.ping();
    console.log('Redis connected');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};