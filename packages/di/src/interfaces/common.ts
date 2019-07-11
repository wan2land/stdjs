
export type ConstructType<T> = (new (...args: any[]) => T) | Function

export type MaybePromise<T> = T | Promise<T>
