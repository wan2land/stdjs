
import "jest"

import { CacheConfig, create } from "../dist"

const testcases = ["local", "memcached", "redis"]

const configs: {[testcase: string]: CacheConfig} = {
  local: {
    adapter: "local",
  },
  memcached: {
    adapter: "memcached",
    location: "127.0.0.1:11211",
  },
  redis: {
    adapter: "redis",
    host: "127.0.0.1",
    port: 6379,
  },
}

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe("cache", () => {

  testcases.forEach(testcase => {
    it(`test ${testcase} basic methods`, async () => {
      const cache = create(configs[testcase])
      await expect(cache.clear()).resolves.toBeTruthy()

      for (let i = 0; i < 10; i++) {
        await expect(cache.set(`item_${i}`, `data ${i}`)).resolves.toBeTruthy()
      }

      for (let i = 0; i < 10; i++) {
        await expect(cache.has(`item_${i}`)).resolves.toBeTruthy()
        await expect(cache.get(`item_${i}`)).resolves.toBe(`data ${i}`)
      }

      // remove item 0
      await expect(cache.delete(`item_0`)).resolves.toBeTruthy()
      await expect(cache.delete(`item_0`)).resolves.toBeFalsy()

      await expect(cache.has(`item_0`)).resolves.toBeFalsy()
      await expect(cache.get(`item_0`)).resolves.toBeUndefined()

      for (let i = 1; i < 10; i++) {
        await expect(cache.has(`item_${i}`)).resolves.toBeTruthy()
        await expect(cache.get(`item_${i}`)).resolves.toBe(`data ${i}`)
      }

      cache.close()
    })

    it(`test ${testcase} expire`, async () => {
      const cache = create(configs[testcase])
      await cache.clear()

      for (let i = 0; i < 10; i++) {
        await cache.set(`item_${i}`, `data ${i}`, 2)
      }

      await timeout(1300)

      for (let i = 0; i < 10; i++) {
        await expect(cache.has(`item_${i}`)).resolves.toBeTruthy()
        await expect(cache.get(`item_${i}`)).resolves.toBe(`data ${i}`)
      }

      await timeout(1000)

      for (let i = 0; i < 10; i++) {
        await expect(cache.has(`item_${i}`)).resolves.toBeFalsy()
        await expect(cache.get(`item_${i}`)).resolves.toBeUndefined()
      }

      cache.close()
    })
  })
})
