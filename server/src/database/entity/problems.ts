import {
    Entity,
    Column,
    Index,
    Unique,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
} from "typeorm";

import { RecordsSolved } from "./recordsSolved";

@Entity({
    name: "problems"
})
@Index(["problem_id"], { unique: true })
export class Problems {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id?: number;

    @Column({ type: "int" })
    problem_id?: number;

    @Column({ type: "longtext", nullable: true })
    title?: string;

    @Column({ type: "longtext", nullable: true })
    tags?: string;

    @Column({ type: "tinyint" })
    is_solvable?: number;

    @Column({ type: "int" })
    accepted_user_count?: number;

    @Column({ type: "int" })
    level?: number;

    @Column({ type: "int" })
    average_tries?: number;

    @OneToMany(
        () => RecordsSolved,
        (records_solved) => records_solved.problem,
        {
            cascade: true,
        }
    )
    records_solved?: RecordsSolved[];
}

