export class Cache {
  private store: Map<string, { value: any; expiresAt?: number }> = new Map();

  set(key: string, value: any, expiresIn?: string | number): void {
    this.cleanup();
    const expiresAt = expiresIn ? Date.now() + this.parseExpiresIn(expiresIn) : undefined;
    this.store.set(key, { value, expiresAt });
  }

  get(key: string): any | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  private cleanup(): void {
    const now = Date.now();

    this.store.forEach((entry, key) => {
      if (entry.expiresAt && entry.expiresAt < now) {
        this.store.delete(key);
      }
    });
  }

  private parseExpiresIn(expiresIn: string | number): number {
    if (typeof expiresIn === "number") {
      return expiresIn * 1000;
    }

    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error("Invalid expiresIn format. Use a number or a string like '10s', '5m', '7d'");
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error("Unsupported time unit");
    }
  }
}
