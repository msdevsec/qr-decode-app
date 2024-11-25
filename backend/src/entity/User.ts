import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Scan } from './Scan';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Scan, scan => scan.user)
  scans!: Scan[];
}