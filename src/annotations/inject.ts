
import {inject as injectMetadata} from "./metadata"
import {Identifier} from "../interfaces"

export function inject(name: Identifier): (target: any, targetKey: string, index?: number) => void {
  return (target: any, targetKey?: string, index?: number) => {
    if (typeof targetKey !== "undefined" && typeof index !== "number") {
      throw new Error("inject annotation must be in constructor parameters.")
    }
    if (!injectMetadata.has(target)) {
      injectMetadata.set(target, [])
    }
    const params = injectMetadata.get(target)!
    params.push([index!, name])
  }
}
