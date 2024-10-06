import { type IRequestStrict, IttyRouter, type RequestLike, error, json } from "itty-router";
import { handle } from "../handle";
import { cpus } from "./utils";

const router = IttyRouter<IRequestStrict>();

router
  .post(
    "/",
    async (req) =>
      await handle({
        body: await req.text(),
        publicKey: process.env.PUBLIC_KEY!,
        clusterUrls: process.env.CLUSTER_URLS!.split(","),
        signature: req.headers.get("X-Signature-Ed25519") ?? "",
        timestamp: req.headers.get("X-Signature-Timestamp") ?? "",
      }),
  )
  .all("*", () => error(404));

Bun.serve({
  port: process.env.PORT,
  reusePort: cpus !== 1,
  fetch: (req: RequestLike, ...args: unknown[]) =>
    router
      .fetch(req, ...args)
      .then(json)
      .catch(error),
});
