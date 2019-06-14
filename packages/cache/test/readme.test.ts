
import "jest"
import { getConfig, timeout } from "./helper"

import { create, LocalCache, MemcachedCache, MemcachedCacheConfig, RedisCache, RedisCacheConfig } from "../dist"

describe("readmd", () => {
  it("test create local", async () => {
    // section:create-local
    const storage = create({
      adapter: "local",
    })
    // endsection

    expect(storage instanceof LocalCache).toBeTruthy()

    storage.close()
  })

  it("test create memcached", async () => {
    const options = {}
    const location = ((await getConfig("memcached")) as MemcachedCacheConfig).location

    // section:create-memcached
    const storage = create({
      adapter: "memcached",

      // https://www.npmjs.com/package/memcached#server-locations
      location, // like, "127.0.0.1:11211", ["127.0.0.1:11211", "127.0.0.1:11212"] ...

      // https://www.npmjs.com/package/memcached#options
      ...options,
    })
    // endsection

    expect(storage instanceof MemcachedCache).toBeTruthy()

    storage.close()
  })

  it("test create redis", async () => {
    const port = ((await getConfig("redis")) as RedisCacheConfig).port
    const options = {
      host: "127.0.0.1",
      port,
    }

    // section:create-redis
    const storage = create({
      adapter: "redis",

      // https://www.npmjs.com/package/redis#rediscreateclient
      ...options,
    })
    // endsection

    expect(storage instanceof RedisCache).toBeTruthy()

    storage.close()
  })
})
