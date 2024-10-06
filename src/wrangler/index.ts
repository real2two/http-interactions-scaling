import { type IRequestStrict, IttyRouter, type RequestLike, error, json } from "itty-router";
import { handle } from "../handle";

const router = IttyRouter<IRequestStrict, [{ PUBLIC_KEY: string; CLUSTER_URLS: string }]>();

router
  .post(
    "/",
    async (req, env) =>
      await handle({
        body: await req.text(),
        publicKey: env.PUBLIC_KEY,
        clusterUrls: env.CLUSTER_URLS.split(","),
        signature: req.headers.get("X-Signature-Ed25519") ?? "",
        timestamp: req.headers.get("X-Signature-Timestamp") ?? "",
      }),
  )
  .all("*", () => error(404));

export default {
  fetch: (req: RequestLike, ...args: unknown[]) =>
    router
      .fetch(req, ...args)
      .then(json)
      .catch(error),
};
