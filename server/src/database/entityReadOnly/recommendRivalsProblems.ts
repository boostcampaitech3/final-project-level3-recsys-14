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
    name: "recommend_rivals_problems"
})
@Index(["handle"], { unique: true })
export class RecommendRivalsProblems {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id?: number;

    @Column()
    handle?: string;

    @Column({ type: "longtext", nullable: true })
    rec_problems?: string;

    @ManyToOne(
        () => Users,
        (users) => users.handle,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({ name: "handle", referencedColumnName: "handle" })
    users?: Users[];
}

