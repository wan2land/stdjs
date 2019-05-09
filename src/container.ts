import { Descriptor } from "./descriptor"
import { ConstructType } from "./interfaces/common"
import { Containable, ContainerFluent, Provider } from "./interfaces/container"
import { MetadataInject } from "./metadata"

export class Container implements Containable {

  public descriptors: Map<PropertyKey, Descriptor<any>>
  public instances: Map<PropertyKey, any>
  public factories: Map<PropertyKey, () => any>
  public binds: Map<PropertyKey, ConstructType<any>>
  public aliases: Map<PropertyKey, string>
  public providers: Provider[]
  public isBooted = false

  public constructor() {
    this.instances = new Map<PropertyKey, any>()
    this.descriptors = new Map<PropertyKey, Descriptor<any>>()
    this.factories = new Map<PropertyKey, () => any>()
    this.binds = new Map<PropertyKey, ConstructType<any>>()
    this.aliases = new Map<PropertyKey, string>()
    this.providers = []
  }

  public instance<P>(name: PropertyKey, value: P | Promise<P>): void {
    this.instances.set(name, value)
  }

  public factory<P>(name: PropertyKey, factory: () => P | Promise<P>): ContainerFluent<P> {
    this.delete(name)
    this.factories.set(name, factory)
    const descriptor = new Descriptor<P>()
    this.descriptors.set(name, descriptor)
    return descriptor
  }

  public bind<P>(name: PropertyKey, constructor: ConstructType<P>): ContainerFluent<P> {
    this.delete(name)
    this.binds.set(name, constructor)
    const descriptor = new Descriptor<P>()
    this.descriptors.set(name, descriptor)
    return descriptor
  }

  public async create<P>(ctor: ConstructType<P>): Promise<P> {
    const params = []
    const options = (MetadataInject.get(ctor) || []).filter(({propertyKey}) => !propertyKey)
    for (const {index, name} of options) {
      params[index] = await this.get(name)
    }
    return new (ctor as any)(...params)
  }

  public async get<P>(name: PropertyKey): Promise<P> {
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
    let instance: P

    if (this.factories.has(name)) {
      const factory = this.factories.get(name)!
      instance = await factory()
    } else if (this.binds.has(name)) {
      instance = await this.create(this.binds.get(name)!)
    } else {
      throw new Error(`"${typeof name === "symbol" ? name.toString() : name}" is not defined!`)
    }

    for (const afterHandler of descriptor.afterHandlers) {
      instance = await afterHandler(instance)
    }
    if (descriptor.isSingleton) {
      this.instances.set(name, instance) // caching
    }
    return instance
  }

  public delete(...names: PropertyKey[]): void {
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

  public async boot(forced = false): Promise<void> {
    if (!this.isBooted || forced) {
      await Promise.all(this.providers.map(provider => provider.register(this)))
      for (const provider of this.providers) {
        if (!provider.boot) {
          continue
        }
        await provider.boot(this)
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
        await provider.close(this)
      }
      this.isBooted = false
    }
  }
}
