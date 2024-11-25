import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('scans')
export class Scan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column('text')
  content!: string;

  @Column()
  type!: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => User, user => user.scans)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}