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

import { Users } from "./users";

@Entity({
    name: "problems_solved"
})
@Index(["handle"], { unique: true })
export class ProblemsSolved {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id?: number;

    @Column()
    handle?: string;

    @Column({ type: "longtext", nullable: true })
    problems?: string;

    @ManyToOne(
        () => Users,
        (users) => users.handle,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({ name: "handle", referencedColumnName: "handle" })
    users?: Users[];
}

