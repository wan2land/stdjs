import { Descriptor } from "./descriptor"
import {
  Containable,
  ContainerFluent,
  Identifier,
  Provider
  } from "./interfaces"
import { metadataInject } from "./metadata"


export class Container implements Containable {

  protected descriptors: Map<Identifier, Descriptor<any>>
  protected instances: Map<Identifier, any>
  protected factories: Map<Identifier, () => any>
  protected binds: Map<Identifier, {new (...args: any[]): any}>
  protected aliases: Map<Identifier, string>
  protected providers: Provider[]
  protected isBooted = false

  constructor() {
    this.instances = new Map<Identifier, any>()
    this.descriptors = new Map<Identifier, Descriptor<any>>()
    this.factories = new Map<Identifier, () => any>()
    this.binds = new Map<Identifier, {new (...args: any[]): any}>()
    this.aliases = new Map<Identifier, string>()
    this.providers = []
  }

  public instance<P>(name: Identifier, value: P | Promise<P>): void {
    this.instances.set(name, value)
  }

  public factory<P>(name: Identifier, factory: () => P | Promise<P>): ContainerFluent<P> {
    this.delete(name)
    this.factories.set(name, factory)
    const descriptor = new Descriptor<P>()
    this.descriptors.set(name, descriptor)
    return descriptor
  }

  public bind<P>(name: Identifier, constructor: {new (...args: any[]): P}): ContainerFluent<P> {
    this.delete(name)
    this.binds.set(name, constructor)
    const descriptor = new Descriptor<P>()
    this.descriptors.set(name, descriptor)
    return descriptor
  }

  public async get<P>(name: Identifier): Promise<P> {
    if (this.descriptors.has(name)) {
      (this.descriptors.get(name) as Descriptor<P>).freeze()
    }
    while (this.aliases.has(name)) {
      name = this.aliases.get(name) as string
    }
    if (this.instances.has(name)) {
      return this.instances.get(name) as P
    }

    if (!this.descriptors.has(name)) {
      throw new Error(`"${typeof name === "symbol" ? name.toString() : name}" is not defined!`)
    }

    const descriptor = this.descriptors.get(name)!
    let instance: P|Promise<P>

    if (this.factories.has(name)) {
      const factory = this.factories.get(name)!
      instance = factory()
    } else if (this.binds.has(name)) {
      const cls = this.binds.get(name)!
      const params = []
      for (const [index, identifier] of metadataInject.get(cls) || []) {
        params[index] = await this.get(identifier)
      }
      instance = new cls(...params)
    } else {
      throw new Error(`"${typeof name === "symbol" ? name.toString() : name}" is not defined!`)
    }

    if (instance instanceof Promise) {
      instance = await instance
    }

    for (const afterHandler of descriptor.afterHandlers) {
      const handlerResult = afterHandler(instance)
      instance = (handlerResult instanceof Promise)
        ? await handlerResult
        : handlerResult
    }
    if (descriptor.isSingleton) {
      this.instances.set(name, instance) // caching
    }
    return instance
  }

  public delete(...names: Identifier[]): void {
    for (const name of names) {
      if (this.descriptors.has(name)) {
        const descriptor = this.descriptors.get(name) as Descriptor<any>
        if (descriptor.isFrozen) {
          throw new Error(`cannot change ${typeof name === "symbol" ? name.toString() : name}`)
        }
        this.descriptors.delete(name)
      }
      this.instances.delete(name)
      this.factories.delete(name)
      this.aliases.delete(name)
    }
  }

  public register(provider: Provider): void {
    this.providers.push(provider)
  }

  public async boot(): Promise<void> {
    if (!this.isBooted) {
      for (const provider of this.providers) {
        const registering = provider.register(this)
        if (registering instanceof Promise) {
          await registering
        }
      }
      for (const provider of this.providers) {
        if (!provider.boot) {
          continue
        }
        const booting = provider.boot(this)
        if (booting instanceof Promise) {
          await booting
        }
      }
      this.isBooted = true
    }
  }

  public async close(): Promise<void> {
    if (this.isBooted) {
      for (const provider of this.providers) {
        if (!provider.close) {
          continue
        }
        const closing = provider.close(this)
        if (closing instanceof Promise) {
          await closing
        }
      }
      this.isBooted = false
    }
  }
}
