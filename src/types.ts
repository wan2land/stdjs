
export interface ContainerFluent<P> {
  freeze(): ContainerFluent<P>
  factory(): ContainerFluent<P>
  after(handler: (context: P) => P|Promise<P>): ContainerFluent<P>
}
