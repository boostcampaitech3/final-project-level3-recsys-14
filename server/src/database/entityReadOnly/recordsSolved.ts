import user from "../../api/routers/users";
import {
    Entity,
    Column,
    Index,
    Unique,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
    Timestamp,
    JoinColumn,
} from "typeorm";

import { Users } from "./users";


@Entity({
    name: "records_solved",
})
export class RecordsSolved{
    @PrimaryGeneratedColumn({ type: "bigint" })
    id?: number;

    @Column()
    handle?: string;

    @Column()
    problem?: number;

    @Column({ type: "timestamp" })
    timestamp?: Date;

    @ManyToOne(
        () => Users,
        (users) => users.handle,{
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({ name: "handle", referencedColumnName: "handle" })
    users?: Users[];
}