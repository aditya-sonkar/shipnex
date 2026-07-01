const { createClient } =
    require("redis");

const rawUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const redisUrl = rawUrl.replace(/^["']|["']$/g, "").trim();
let client = null;
let isConnected = false;

if (process.env.NODE_ENV !== "test") {
    client = createClient({ url: redisUrl });

    client.on("error", (err) => {
        console.warn(">>> [Redis Client] Connection error/disconnected:", err.message);
        isConnected = false;
    });

    client.on("connect", () => {
        console.log(">>> [Redis Client] Connecting to Redis...");
        isConnected = true;
    });

    client.on("ready", () => {
        console.log(">>> [Redis Client] Connection established successfully!");
        isConnected = true;
    });

    //Handle connection asynchronously to avoid blocking server boot

    client.connect().catch((err) => {
        console.warn(">>> [Redis Client] Failed to connect to Redis. Running in fallback mode without cache.");
    });
}

// Fetch Parsed JSON value from cache 

const getCache = async (key) => {
    if (!isConnected || !client)
        return null;
    try {
        const data = await
            client.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        console.error(">>> [Redis Client] Cache GET error:", error);
        return null;
    }
};

// Save value as stringified JSON in cache with optional TTL

const setCache = async (key, value, ttlSeconds = 3600) => {
    if (!isConnected || !client)
        return;
    try {
        await client.set(key, JSON.stringify(value), {
            EX: ttlSeconds,
        });
    } catch (error) {
        console.error(">>> [Redis Client] Cache SET error:", error);
    }
};

// Remove Key from cache (invalidation)

const deleteCache = async (key) => {
    if (!isConnected || !client)
        return;
    try {
        await client.del(key);
    } catch (error) {
        console.error(">>> [Redus Client] Cache DEL error:", error);
    }
};

module.exports = {
    getCache,
    setCache,
    deleteCache,
    client,
};