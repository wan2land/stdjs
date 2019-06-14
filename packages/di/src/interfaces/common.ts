
export type ConstructType<P> = (new (...args: any[]) => P) | Function

export type MaybePromise<P> = P | Promise<P>
