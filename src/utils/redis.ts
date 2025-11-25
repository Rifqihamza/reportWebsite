import { createClient } from "redis";

let redis: ReturnType<typeof createClient>;

if (!((globalThis as any).__redisClient)) {
  redis = createClient({
    url: import.meta.env.REDIS_URL
  });

  redis.on("error", err => {
    console.error(`[REDIS] error: ${err}`);
  });

  (globalThis as any).__redisClient = redis.connect()
    .then(() => redis)
    .catch((e) => {
      console.error("Redis connection error:", e);
      throw e;
    });
}

export const redisClient = (globalThis as any).__redisClient as Promise<
  ReturnType<typeof createClient>
>;