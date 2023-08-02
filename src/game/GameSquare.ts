export class GameSquare {
  private claimedBy: string | undefined;
  private lockedBy: string | undefined;

  claimFor(player: string) {
    if (this.claimedBy) {
      throw new Error("That square has already been claimed");
    } else if (this.isLockedFor(player)) {
      throw new Error("That square can't be claimed");
    }

    this.claimedBy = player;
  }

  public lock(playerName: string): void {
    if (this.isLockedFor(playerName)) {
      throw new Error(
        `That square has already been locked by ${this.lockedBy}`
      );
    }

    this.lockedBy = playerName;
  }

  public unlock(playerName: string): void {
    if (this.lockedBy !== playerName) {
      throw new Error(
        `That player cannot unlock that square as it locked by ${this.lockedBy}`
      );
    }

    this.lockedBy = undefined;
  }

  public isLockedFor(player: string): boolean {
    return this.lockedBy ? this.lockedBy !== player : false;
  }

  public isClaimed(): boolean {
    return !!this.claimedBy;
  }

  public claimant(): string {
    return this.claimedBy || "";
  }
}
