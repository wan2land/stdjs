
export type Scalar = string | number | boolean | null


export type ConstructType<P> = (new (...args: any[]) => P) | Function

export type ConstructFactory<P> = (type: any) => ConstructType<P>


export type MaybeArray<P> = P | P[]

export type MaybePromise<P> = Promise<P> | P
