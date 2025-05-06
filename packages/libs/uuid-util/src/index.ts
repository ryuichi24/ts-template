export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generateUUIDBuffer(): Buffer<ArrayBuffer> {
  return toBufferUUID(generateUUID());
}

export function toBufferUUID(uuid: string): Buffer<ArrayBuffer> {
  return Buffer.from(uuid.replace(/-/g, ""), "hex");
}

export function toStringUUID(buffer: Buffer<ArrayBuffer>): string {
  return buffer.toString("hex").replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
}
