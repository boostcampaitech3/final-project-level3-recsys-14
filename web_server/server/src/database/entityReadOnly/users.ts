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
import { ProblemsSolved } from "./problemsSolved";

@Entity({
    name: "users"
})
@Index(["handle"], { unique: true })
export class Users {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id?: number;

    @Column()
    handle?: string;

    @Column({ type: "int" })
    solved_count?: number;

    @Column({ type: "int" })
    user_class?: number;

    @Column({ type: "int" })
    tier?: number;

    @Column({ type: "int" })
    rating?: number;

    @Column({ type: "int" })
    rating_by_problems_sum?: number;

    @Column({ type: "int" })
    rating_by_class?: number;

    @Column({ type: "int" })
    rating_by_solved_count?: number;

    @Column({ type: "bigint" })
    exp?: string;

    @Column({ type: "int" })
    rival_count?: number;

    @Column({ type: "int" })
    reverse_rival_count?: number;

    @Column({ type: "int" })
    max_streak?: number;

    @Column({ type: "int" })
    rank?: number;

    @Column({ type: "longtext", nullable: true })
    organization?: string;

    @OneToMany(
        () => RecordsSolved,
        (records_solved) => records_solved.handle,
        {
            cascade: true,
        }
    )
    records_solved?: RecordsSolved[];

    @OneToMany(
        () => ProblemsSolved,
        (problems_solved) => problems_solved.handle,
        {
            cascade: true,
        }
    )
    problems_solved?: ProblemsSolved[];
}

