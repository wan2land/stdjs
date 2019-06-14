
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// monkey patch
const originConsoleLog = console.log
let consoleStorage = [] as any[]

export function startConsoleCapture(): void {
  consoleStorage = []
  console.log = (data) => { consoleStorage.push(data) }
}

export function endConsoleCapture(): any[] {
  console.log = originConsoleLog
  return consoleStorage
}
