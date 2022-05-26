import { Express } from "express";
import expressLoader from "./express";
import databaseConnection from "./connect";

export default async (app: Express) => {
    await expressLoader(app);
    console.log("Express Middlewares loaded");

    await databaseConnection();
    console.log("Database Connection loaded");
}