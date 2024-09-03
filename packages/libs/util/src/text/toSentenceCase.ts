/**
 * @description
 * Converts text into sentence case by capitalizing the first letter of the each words.
 */

export function toSentenceCase(text: string): string {
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
