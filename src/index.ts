import { config } from "./config";
import { GameServer } from "./network/GameServer";

const server = new GameServer();

server.start(config.host, config.port);
