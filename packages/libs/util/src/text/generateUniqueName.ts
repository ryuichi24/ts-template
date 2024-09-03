/**
 * Generates a unique string name based on the provided target string and list of items.
 * If the target string matches any existing item's keyToken in the list, it increments
 * the value and returns a unique string. Otherwise, it returns the original target string.
 *
 * @param target The target string to generate a unique name for.
 * @param items An array of items to compare against the target string.
 * @param keyToken The key token representing the string property to compare against in each item.
 * @param template (Optional) The template for the "copy of" prefix. Defaults to "Copy of".
 * @returns A unique string name based on the target string and the list of items.
 */
export function generateUniqueName<TItem>(target: string, items: TItem[], keyToken: keyof TItem, template = "Copy of") {
  // Trim leading and trailing spaces from the template
  const trimmedTemplate = template.trim();

  // If the trimmed template is empty, use a default value
  const effectiveTemplate = trimmedTemplate === "_" ? "" : trimmedTemplate || "Copy of";

  // extract the token key
  const entries = items.map((it) => it[keyToken]) as string[];

  if (entries.length <= 0) {
    return target;
  }

  const targetNameRegex = new RegExp(`^${effectiveTemplate} (.+?)( (\\d+))?$`);
  const match = target.match(targetNameRegex);

  if (match) {
    // The item has already been duplicated, increment the number
    const baseName = match[1];
    const currentNumber = match[3] ? parseInt(match[3], 10) : 0;
    const newName = `${effectiveTemplate} ${baseName} ${currentNumber + 1}`.trim();

    // Check if the new name already exists in the list
    if (entries.includes(newName)) {
      // Increment the number until a unique name is found
      let incrementedName: string;
      let nextNumber = currentNumber + 1;
      do {
        incrementedName = `${effectiveTemplate} ${baseName} ${nextNumber}`.trim();
        nextNumber++;
      } while (entries.includes(incrementedName));
      return incrementedName;
    } else {
      return newName;
    }
  } else {
    // The item is not duplicated yet, add 'Copy of' prefix and check for uniqueness
    const newName = `${effectiveTemplate} ${target}`.trim();
    if (entries.includes(newName)) {
      // Increment the number until a unique name is found
      let incrementedName: string;
      let nextNumber = 1;
      do {
        incrementedName = `${effectiveTemplate} ${target} ${nextNumber}`.trim();
        nextNumber++;
      } while (entries.includes(incrementedName));
      return incrementedName;
    } else {
      return newName;
    }
  }
}
