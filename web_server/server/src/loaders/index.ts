import { Express } from "express";
import expressLoader from "./express";
import { readOnlyConnection, writeableConnection} from "./connect";

export default async (app: Express) => {
    await expressLoader(app);
    console.log("Express Middlewares loaded");

    await readOnlyConnection();
    await writeableConnection();
    console.log("Database Connection loaded");
}