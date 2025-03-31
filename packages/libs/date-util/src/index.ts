export function calculateExpiresAt(expiresIn: string): Date {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) throw new Error("Invalid expiresIn format");

  const [, value, unit] = match;
  const duration = parseInt(value, 10);
  const now = new Date();

  switch (unit) {
    case "d":
      now.setDate(now.getDate() + duration);
      break;
    case "h":
      now.setHours(now.getHours() + duration);
      break;
    case "m":
      now.setMinutes(now.getMinutes() + duration);
      break;
    case "s":
      now.setSeconds(now.getSeconds() + duration);
      break;
    default:
      throw new Error("Unsupported time unit");
  }

  return now;
}
