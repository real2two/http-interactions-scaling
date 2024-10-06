export const cpus = process.env.CLUSTERS === "auto" ? navigator.hardwareConcurrency : Number(process.env.CLUSTERS);
