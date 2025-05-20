const { createClient } = require("redis");
const appError = require("../utils/appError");
const { getStatusFilter } = require("../utils/filter");

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.error("Redis Client Error", err));

client.connect(); // Only once on app start

// Cache middleware
// This middleware caches the response for a specific email and status filter
async function cache(req, res, next) {
  try {
    const filter = getStatusFilter(req.query.status, next);
    const email = req.params.email || req.body.email || req.query.email;

    if (!email) {
      return next(new appError("Email is required for caching", 400));
    }

    const cacheKey = `order:${email}`;
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      let orders = JSON.parse(cachedData);
      if (filter) {
        orders = orders.filter((order) => {
          if (filter.status) {
            return order.status === filter.status;
          }
          return true;
        });
        if (orders.length === 0) {
          return next(
            new appError("No orders found with the given filter", 404)
          );
        }
      }

      return res.status(200).json({
        status: "success",
        message: "Orders retrieved from cache",
        data: {
          orders,
        },
      });
    }

    // Override res.json to cache the response
    res.sendResponse = res.json;
    res.json = async (body) => {
      if (body?.data?.orders) {
        await client.set(cacheKey, JSON.stringify(body.data.orders), {
          EX: 3600, // 1 hour
        });
      }
      res.sendResponse(body);
    };

    next();
  } catch (err) {
    console.error("Cache middleware error:", err);
    return next(); // Skip cache, proceed normally
  }
}

module.exports = {
  cache,
};
