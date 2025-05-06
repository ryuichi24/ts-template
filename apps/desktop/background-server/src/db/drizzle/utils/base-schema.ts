import { id } from "./id.js";
import { textTimestamp } from "./text-timestamp.js";

export const baseSchema = {
  id: id(),
  ...textTimestamp,
};
