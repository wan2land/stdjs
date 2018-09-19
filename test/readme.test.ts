
import "jest"

import { create, LocalCache, MemcachedCache, RedisCache } from "../dist"

describe("readmd", () => {
  it("test create local", async () => {
    // section:create-local
    const storage = create({
      adapter: "local",
    })
    // endsection

    expect(storage instanceof LocalCache).toBeTruthy()
  })

  it("test create memcached", async () => {
    const options = {}
    // section:create-memcached
    const storage = create({
      adapter: "memcached",

      // https://www.npmjs.com/package/memcached#server-locations
      location: "127.0.0.1:11211",

      // https://www.npmjs.com/package/memcached#options
      ...options,
    })
    // endsection

    expect(storage instanceof MemcachedCache).toBeTruthy()
  })

  it("test create redis", async () => {
    const options = {
      host: "127.0.0.1",
      port: 6379,
    }

    // section:create-redis
    const storage = create({
      adapter: "redis",

      // https://www.npmjs.com/package/redis#rediscreateclient
      ...options,
    })
    // endsection

    expect(storage instanceof RedisCache).toBeTruthy()
  })
})
