export type ClientAction = NewClient | ClaimSquare | LockSquare | UnlockSquare;

export interface NewClient {
  action: "new-client";
  playerName: string;
}

export interface ClaimSquare {
  action: "claim-square";
  x: number;
  y: number;
  playerName: string;
}

export interface LockSquare {
  action: "lock-square";
  x: number;
  y: number;
  playerName: string;
}

export interface UnlockSquare {
  action: "unlock-square";
  x: number;
  y: number;
  playerName: string;
}
