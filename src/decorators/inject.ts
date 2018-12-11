import { Identifier } from "../interfaces"
import { metadataInject } from "../metadata"


export function Inject(name: Identifier): (target: any, targetKey: string, index?: number) => void {
  return (target: any, targetKey?: string, index?: number) => {
    if (typeof targetKey !== "undefined" && typeof index !== "number") {
      throw new Error("inject annotation must be in constructor parameters.")
    }
    if (!metadataInject.has(target)) {
      metadataInject.set(target, [])
    }
    const params = metadataInject.get(target)!
    params.push([index!, name])
  }
}
