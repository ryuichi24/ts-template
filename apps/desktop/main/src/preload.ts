const ARG_PREFIX_FROM_MAIN_PROCESS = "MAIN_PROCESS_ARG";
const argsFromMainProcess = parseArgsFromMain(process.argv);

console.log("Arguments from main process: ", argsFromMainProcess);
console.log("preloaded!");

/**
 *
 * @param args arguments from the main process
 * @returns parsed arguments intentionally passed from the main process to this renderer process
 */
function parseArgsFromMain(args: string[]) {
  const argsFromMainProcess = process.argv
    .filter((entry) => entry.includes(ARG_PREFIX_FROM_MAIN_PROCESS))
    .map((entry) => entry.split(":")[1]);

  return argsFromMainProcess;
}
