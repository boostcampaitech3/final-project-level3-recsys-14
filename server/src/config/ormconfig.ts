import dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";
dotenv.config();

const ormconfig: ConnectionOptions = {
  type: "mysql",
  // host: process.env.RECJOON_RDS_HOST,
  host: "recjoon.cawtppybmipt.ap-northeast-2.rds.amazonaws.com",
  // port: process.env.RECJOON_RDS_PORT,
  port: 3306,
  // username: process.env.RECJOON_RDS_USERNAME,
  username: "admin",
  // password: process.env.RECJOON_RDS_PASSWORD,
  password: "!boostcamp14",
  // database: process.env.RECJOON_RDS_DATABASE,
  database: "recjoon",
  synchronize: true,
  logging: false,
  supportBigNumbers: true,
  bigNumberStrings: false,
  entities: ["{src,dist}/database/entity/*{.ts,.js}"],
  migrations: ["src/database/migration/*{.ts,.js}"],
  subscribers: ["src/database/subscriber/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "src/database/entity",
    migrationsDir: "src/database/migration",
    subscribersDir: "src/database/subscriber"
  }
};

export default ormconfig;