import { Client } from "../network/Client";
import { GameServer } from "../network/GameServer";
import {
  ClaimSquare,
  ClientAction,
  LockSquare,
  NewClient,
  UnlockSquare,
} from "./ClientAction";

export class ClientController {
  constructor(private server: GameServer) {}

  handle(action: ClientAction, client: Client): Buffer {
    try {
      switch (action.action) {
        case "new-client":
          return this.handleNewClient(action, client);

        case "claim-square":
          return this.handleClaimSquare(action, client);

        case "lock-square":
          return this.handleLockSquare(action, client);

        case "unlock-square":
          return this.handleUnlockSquare(action, client);

        default:
          return this.error("Invalid client action");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return this.error(error.message);
      } else {
        return this.error(`${error}`);
      }
    }
  }

  private handleNewClient(data: NewClient, client: Client): Buffer {
    console.log(
      `New client connecting from ${client.getRemoteAddress()} under the name "${
        data.playerName
      }"`
    );

    if (!data.playerName) {
      return this.error("Invalid player name");
    }

    this.server.registerClient(data.playerName, client);

    return this.success(`Successfully connected new player ${data.playerName}`);
  }

  private handleClaimSquare(data: ClaimSquare, _client: Client): Buffer {
    console.log(
      `Square claimed at ${data.x}, ${data.y} for player ${data.playerName}`
    );

    this.server.board.claimSquare({ x: data.x, y: data.y }, data.playerName);

    this.server.broadcast(
      this.update("claim-square", {
        x: data.x,
        y: data.y,
        playerName: data.playerName,
      })
    );

    if (this.server.board.checkIfGameIsOver()) {
      this.server.broadcast(
        this.update("game-end", { winners: this.server.board.getWinners() })
      );
    }

    return this.success("Square successfully claimed");
  }

  private handleLockSquare(data: LockSquare, _client: Client): Buffer {
    console.log(
      `Square locked at ${data.x}, ${data.y} for player ${data.playerName}`
    );

    this.server.board.lockSquare({ x: data.x, y: data.y }, data.playerName);

    this.server.broadcast(
      this.update("lock-square", {
        x: data.x,
        y: data.y,
        playerName: data.playerName,
      })
    );

    return this.success("Square successfully locked");
  }

  private handleUnlockSquare(data: UnlockSquare, _client: Client): Buffer {
    console.log(`Square unlocked at ${data.x}, ${data.y}`);

    this.server.board.unlockSquare({ x: data.x, y: data.y }, data.playerName);

    this.server.broadcast(
      this.update("unlock-square", {
        x: data.x,
        y: data.y,
        playerName: data.playerName,
      })
    );

    return this.success("Square successfully unlocked");
  }

  private error(message: string): Buffer {
    return this.encode({ type: "error", message });
  }

  private success(message: string): Buffer {
    return this.encode({ type: "success", message });
  }

  private update(action: string, data: Record<string, any>): Buffer {
    return this.encode({ type: "update", action, ...data });
  }

  private encode(json: Record<string, any>): Buffer {
    return Buffer.from(JSON.stringify(json) + "\n");
  }
}
