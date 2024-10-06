import { spawn } from "bun";
import { cpus } from "./utils";

console.info("Started server");

if (cpus === 1) {
  import("./server");
} else {
  const buns = new Array(cpus);

  function kill() {
    for (const bun of buns) {
      bun.kill();
    }
  }

  process.on("SIGINT", kill);
  process.on("exit", kill);

  for (let i = 0; i < cpus; i++) {
    buns[i] = spawn({
      cmd: ["bun", "./src/bun/server.ts"],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    });
  }
}
