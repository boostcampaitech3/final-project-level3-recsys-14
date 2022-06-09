import "reflect-metadata";
import express from "express";
import loaders from "./loaders";
import config from "./config";

const server = async() => {
    const app = express();
    console.log(process.env.RECJOON_RDS_HOST)

    const port = process.env.PORT || config.server.AWS_EC2.port;
    const host = process.env.HOST || config.server.AWS_EC2.host;

    await loaders(app);

    app.listen(port, () => {
        console.log(`server start on [ http://${host}:${port} ]`);
    });
};

server();

export default server;