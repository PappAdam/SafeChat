import WebSocket, { WebSocketServer } from "ws";
import { PrismaClient } from "@prisma/client";
import express from "express";
import authRouter, { extractUserFromToken } from "./http/auth";
import bodyParser from "body-parser";
import {
  ClientMessage,
  ClientHeader,
  ServerMessage,
  ServerHeader,
} from "../../types";
import * as msgpack from "@msgpack/msgpack";
import logRouter from "./http/log";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import YAML from "yamljs";

export const prisma = new PrismaClient();

const socketServer = new WebSocketServer({ port: 8080 });

const clients: WebSocket[] = [];

socketServer.on("listening", () => {
  console.log("WebSocket server listening on port 8080");
});
socketServer.on("connection", (newClient) => {
  clients.push(newClient);

  newClient.on("message", (message) => {
    let decoded = msgpack.decode(message as Uint8Array) as ClientMessage;
    switch (decoded.header) {
      case ClientHeader.NewMsg:
        let svmsg: ServerMessage = {
          header: ServerHeader.NewMsg,
          data: decoded.data,
        };

        clients.forEach((c) => c.send(msgpack.encode(svmsg)));
        break;
    }
  });

  newClient.on("close", () => {
    const client_index = clients.findIndex((c) => c == newClient);
    clients.splice(client_index, 1);
  });
});

const httpServer = express();

const swaggerDocument = YAML.load(path.join(__dirname, "../docs/index.yml"));

httpServer.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

httpServer.use(bodyParser.json());
httpServer.use("/auth", authRouter);

// You can use req.user after this middleware runs
const protectedRoutes = httpServer.use(extractUserFromToken);

protectedRoutes.use("/log", logRouter);

httpServer.listen(3000, () => {
  console.log("HTTP server listening on port 3000");
});
