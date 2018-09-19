
import { Cache } from "./interfaces/cache"
import { CacheConfig } from "./interfaces/config"

import { LocalCache } from "./driver/local/cache"

export function create<P>(config: CacheConfig): Cache {
  if (config.adapter === "local") {
    return new LocalCache()
  }
  throw new Error(`cannot resolve adapter named "${(config as any).adapter}"`)
}
