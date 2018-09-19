
import "jest"

import { create, LocalCache, MemcachedCache } from "../dist"

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
})
