import { GameSquare } from "./GameSquare";

export interface GameSquareCoord {
  x: number;
  y: number;
}

export class GameBoard {
  private squares: GameSquare[][];

  constructor(rows: number, cols: number) {
    this.squares = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => new GameSquare())
    );
  }

  claimSquare(coord: GameSquareCoord, playerName: string): void {
    const square = this.getSquare(coord);

    square.claimFor(playerName);
  }

  lockSquare(coord: GameSquareCoord, playerName: string): void {
    const square = this.getSquare(coord);

    square.lock(playerName);
  }

  unlockSquare(coord: GameSquareCoord, playerName: string): void {
    const square = this.getSquare(coord);

    square.unlock(playerName);
  }

  checkIfGameIsOver(): boolean {
    return this.allSquares().every((s) => s.isClaimed());
  }

  getWinners(): string[] {
    const scores = Object.entries(
      this.allSquares().reduce((acc, square) => {
        if (!acc[square.claimant()]) {
          acc[square.claimant()] = 1;
        } else {
          acc[square.claimant()] += 1;
        }

        return acc;
      }, {} as Record<string, number>)
    ) as [playerName: string, score: number][];

    const highestScore = Math.max(...scores.map((s) => s[1]));

    return scores.filter((s) => s[1] === highestScore).map((s) => s[0]);
  }

  private allSquares(): GameSquare[] {
    return this.squares.flat();
  }

  private getSquare(coord: GameSquareCoord): GameSquare {
    const square = this.squares[coord.y]?.[coord.x];

    if (!square) {
      throw new Error(
        `Couldn't find the game square at ${coord.x}, ${coord.y}`
      );
    }

    return square;
  }
}
