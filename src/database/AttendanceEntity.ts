import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlanEntity } from "./PlanEntity";

@Entity()
export class AttendanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  member: string;

  @CreateDateColumn()
  attendedAt: Date;

  @ManyToOne((type) => PlanEntity, (plan) => plan.attendances)
  plan: PlanEntity;
}
