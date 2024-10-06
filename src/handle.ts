import crypto from "node:crypto";
import { error, json } from "itty-router";
import { verify } from "discord-verify";
import type { APIBaseInteraction, InteractionType } from "discord-api-types/v10";

export async function handle({
  body,
  publicKey,
  signature,
  timestamp,
  clusterUrls,
}: { body: string; publicKey: string; clusterUrls: string[]; signature: string; timestamp: string }) {
  const isValid = await verify(body, signature, timestamp, publicKey, crypto.webcrypto.subtle);
  if (!isValid) return error(401);

  const { type, guild_id: guildId }: APIBaseInteraction<InteractionType, unknown> = JSON.parse(body);
  if (type === 1) return json({ type: 1 });

  const clusterId = (BigInt(guildId ?? "") >> 22n) % BigInt(clusterUrls.length);
  const clusterUrl = clusterUrls[Number(clusterId)];

  return await fetch(clusterUrl, {
    method: "post",
    body,
    headers: {
      "X-Signature-Ed25519": signature,
      "X-Signature-Timestamp": timestamp,
    },
  });
}
