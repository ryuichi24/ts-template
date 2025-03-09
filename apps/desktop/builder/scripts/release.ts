const shouldPublish = process.env.TST_ELECTRON_PUBLISH === "1"

console.log("release: ", { shouldPublish });
