import {
    Entity,
    Column,
    Index,
    Unique,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from "typeorm";

@Entity({
    name: "feedback"
})
@Index(["handle"], { unique: true })
export class Feedback {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id?: number;

    @Column()
    handle?: string;

    @Column({ type: "tinyint", nullable: true })
    problem_rating?: number;

    @Column({ type: "longtext", nullable: true })
    problem_feedback?: string;

    @Column({ type: "tinyint", nullable: true  })
    rival_rating?: number;

    @Column({ type: "longtext", nullable: true })
    rival_feedback?: string;
}
