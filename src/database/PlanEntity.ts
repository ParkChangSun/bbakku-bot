import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { AttendanceEntity } from "./AttendanceEntity";

@Entity()
export class PlanEntity {
  @PrimaryColumn()
  name: string;

  @Column({ nullable: true })
  type?: string;
  // enum

  @Column("simple-array", { nullable: true })
  member?: string[];

  @Column()
  goal: string;

  @Column({ type: "date", nullable: true })
  d_day?: string;

  @OneToMany(() => AttendanceEntity, (att) => att.plan)
  attendances?: AttendanceEntity[];
}
