import IORedis from "ioredis";
import { env } from "./env";

// Singleton para evitar múltiplas conexões em hot-reload (dev) e em
// invocações serverless reaproveitando contexto (Vercel).
declare global {
  // eslint-disable-next-line no-var
  var __redis: IORedis | undefined;
}

function createRedis(): IORedis {
  return new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null, // exigido pelo BullMQ
    enableReadyCheck: true,
    // lazyConnect: melhor para serverless (Vercel) — conecta só no primeiro uso.
    // No worker (long-running) também é seguro: a primeira chamada do BullMQ conecta.
    lazyConnect: true,
  });
}

export const redis: IORedis = global.__redis ?? createRedis();
if (env.NODE_ENV !== "production") {
  global.__redis = redis;
}

redis.on("error", (err) => {
  console.error("[redis] error:", err.message);
});
