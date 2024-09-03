/**
 * @description
 * Convert words into title case
 *
 * @returns
 * Words that are title-cased
 */
export function toTitleCase(str: string) {
  const words = str.toLowerCase().split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(" ");
}
