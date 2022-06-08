import { Api404Error } from "../helper/utils/error/baseError";
import { createConnection } from "typeorm";
import { Container } from "typedi";
import connectionOption from "../config/ormconfig";

const connection = async() => {
    try {
        console.log("before createConnection ... ")
        const connection = await createConnection(connectionOption);
        console.log(connectionOption);
        console.log("after createConnection, before entities ... ")
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

export default connection;