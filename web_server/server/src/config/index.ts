import dotenv from "dotenv";
dotenv.config();

export default {
    api: {
        prefix: "/api",
    },

    server: {
        AWS_EC2: {
          host: process.env.RECJOON_SERVER_HOST || "0.0.0.0",
          port: process.env.RECJOON_SERVER_PORT || 8080,
        },
    },

    database: {
        mysql: {
          host: process.env.HOST,
          port: process.env.PORT,
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
          database: process.env.DATABASE,
          entities: [
            `${process.env.NODE_ENV === 'development' ? 'src' : 'dist'}/database/entity/**/*{.ts,.js}`
          ],
          migrations: ["src/database/migration/**/*.ts"],
          subscribers: ["src/database/subscriber/**/*.ts"],
        },
    
        AWS_RDS: {
          host: process.env.RECJOON_RDS_HOST,
          port: process.env.RECJOON_RDS_PORT,
          username: process.env.RECJOON_RDS_USERNAME,
          password: process.env.RECJOON_RDS_PASSWORD,
          database: process.env.RECJOON_RDS_DATABASE,
          entities: [
            `${process.env.NODE_ENV === 'development' ? 'src/' : 'dist/'}database/entity/**/*{.js,.ts}`
          ],
          migrations: ["src/database/migration/**/*.ts"],
          subscribers: ["src/database/subscriber/**/*.ts"],
        },
    },
}