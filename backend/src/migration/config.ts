import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Scan } from '../entity/Scan';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',        // Using localhost since we're running command locally
  port: 5432,
  username: 'user',         // From docker-compose.yml
  password: 'password',     // From docker-compose.yml
  database: 'qrdecoder',    // From docker-compose.yml
  entities: [User, Scan],
  migrations: ['src/migration/*.ts'],
  logging: true
});