
import "jest"

import { CacheConfig, create } from "../dist"

const testcases = ["local"]

const configs: {[testcase: string]: CacheConfig} = {
  local: {
    adapter: "local",
  },
}

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe("cache", () => {

  testcases.forEach(testcase => {
    it(`test ${testcase} basic methods`, async () => {
      const cache = create(configs[testcase])
      await cache.clear()

      for (let i = 0; i < 10; i++) {
        await cache.set(`item_${i}`, `data ${i}`)
      }

      for (let i = 0; i < 10; i++) {
        await expect(cache.get(`item_${i}`)).resolves.toBe(`data ${i}`)
      }

      cache.close()
    })
  })
})
