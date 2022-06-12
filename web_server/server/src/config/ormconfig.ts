import dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";
dotenv.config();

export const readOnlyConfig: ConnectionOptions = {
  name: "default",
  type: "mysql",
  host: process.env.RECJOON_RDS_HOST,
  port: process.env.RECJOON_RDS_PORT as unknown as number,
  username: process.env.RECJOON_RDS_USERNAME,
  password: process.env.RECJOON_RDS_PASSWORD,
  database: process.env.RECJOON_RDS_DATABASE,
  synchronize: false,
  logging: false,
  supportBigNumbers: true,
  bigNumberStrings: false,
  entities: ["{src,dist}/database/entityReadOnly/*{.ts,.js}"],
  migrations: ["src/database/migration/*{.ts,.js}"],
  subscribers: ["src/database/subscriber/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "src/database/entityReadOnly",
    migrationsDir: "src/database/migration",
    subscribersDir: "src/database/subscriber"
  }
};

export const writableConfig: ConnectionOptions = {
  name: "writableConnection",
  type: "mysql",
  host: process.env.RECJOON_RDS_MASTER_HOST,
  port: process.env.RECJOON_RDS_PORT as unknown as number,
  username: process.env.RECJOON_RDS_USERNAME,
  password: process.env.RECJOON_RDS_PASSWORD,
  database: process.env.RECJOON_RDS_DATABASE,
  synchronize: false,
  logging: false,
  supportBigNumbers: true,
  bigNumberStrings: false,
  entities: ["{src,dist}/database/entityWritable/*{.ts,.js}"],
  migrations: ["src/database/migration/*{.ts,.js}"],
  subscribers: ["src/database/subscriber/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "src/database/entityWritable",
    migrationsDir: "src/database/migration",
    subscribersDir: "src/database/subscriber"
  }
};

export default readOnlyConfig;