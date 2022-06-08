import dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";
dotenv.config();

const ormconfig: ConnectionOptions = {
  type: "mysql",
  host: process.env.RECJOON_RDS_HOST,
  port: process.env.RECJOON_RDS_PORT as unknown as number,
  username: process.env.RECJOON_RDS_USERNAME,
  password: process.env.RECJOON_RDS_PASSWORD,
  database: process.env.RECJOON_RDS_DATABASE,
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