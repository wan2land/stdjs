
export type Scalar = string | number | boolean | null

export type Factory<P> = ((type: any) => P)


export type ConstructType<P> = (new (...args: any[]) => P) | Function

export type ConstructFactory<P> = Factory<ConstructType<P>>


export type MaybeArray<P> = P | P[]

export type MaybePromise<P> = P | Promise<P>

export type MaybeFactory<P> = P | Factory<P>
