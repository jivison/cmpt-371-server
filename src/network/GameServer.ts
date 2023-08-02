import { Server, Socket, createServer } from "net";
import { GameBoard } from "../game/GameBoard";
import { Client } from "./Client";

export class GameServer {
  private server: Server;
  private clients: Record<string, Client> = {};
  public board = new GameBoard(10, 10);

  constructor() {
    this.server = createServer();

    this.server.on("connection", (c) => {
      this.handleConnection(c);
    });
  }

  async start(host: string, port: number): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.server.listen(port, host, () => {
        console.log(`Server listening at ${this.getServerAddress()}`);
        resolve();
      });
    });
  }

  public registerClient(name: string, client: Client): void {
    if (this.clients[name]) {
      throw new Error("That name is already taken!");
    }

    this.clients[name] = client;

    console.log(this.clients);
  }

  public async broadcast(data: Buffer): Promise<void> {
    console.log(
      `Broadcasting ${data.toString()} to ${
        Object.values(this.clients).length
      } clients`
    );

    await Promise.all(Object.values(this.clients).map((c) => c.send(data)));
  }

  private handleConnection(c: Socket): void {
    const client = new Client(c, this);

    c.on("data", client.handleData.bind(client));
    c.on("close", client.handleClose.bind(client));
    c.on("error", client.handleError.bind(client));
  }

  private getServerAddress(): string {
    const address = this.server.address();

    if (typeof address === "string") {
      return address;
    } else if (!address) {
      return "";
    } else {
      return `${address.address}:${address.port} (${address.family})`;
    }
  }
}
