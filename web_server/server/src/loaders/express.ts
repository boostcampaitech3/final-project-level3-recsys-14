import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import logger from "../config/winston";
import routers from "../api/routers";
import config from "../config";

export default async (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(helmet());
  app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      maxAge: 3600 * 5,
      credentials: true,
    })
  );

  app.use(config.api.prefix, routers());

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    logger.error("Invaild Request");
    res.status(404).json({ message: "Invaild Request" });
  });
};