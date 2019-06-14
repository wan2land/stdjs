
export function priorityScale(domain: [number, number], range: [number, number]): (input: number) => number {
  return (input: number) => {
    const grad = (range[1] - range[0]) / (domain[1] - domain[0])
    return Math.round(grad * input + range[0] - grad * domain[0])
  }
}
