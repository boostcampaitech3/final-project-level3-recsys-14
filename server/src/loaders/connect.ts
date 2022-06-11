import { Api404Error } from "../helper/utils/error/baseError";
import { createConnection } from "typeorm";
import { Container } from "typedi";
import { readOnlyConfig, writableConfig } from "../config/ormconfig";

export const readOnlyConnection = async() => {
    try {
        console.log("before create connection for read-only database ... ")
        const connection = await createConnection(readOnlyConfig);
        console.log("after create connection, before entities ... ")
        const entities = connection["entityMetadatas"].map(
            (entity: any) => (entity = entity.name)
        );
        console.log(
            "entity file path is: ",
            entities.length <= 0 ? "[ FALSE ]" : "[ TRUE ]"
        );
    } catch (error) {
        console.error(error);
    }
};

export const writeableConnection = async() => {
    try {
        console.log("before create connection for writable database ... ")
        const connection = await createConnection(writableConfig);
        console.log("after create connection, before entities ... ")
        const entities = connection["entityMetadatas"].map(
            (entity: any) => (entity = entity.name)
        );
        console.log(
            "entity file path is: ",
            entities.length <= 0 ? "[ FALSE ]" : "[ TRUE ]"
        );
    } catch (error) {
        console.error(error);
    }
};

export default readOnlyConnection;