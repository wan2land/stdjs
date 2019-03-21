
export function toUnderscore(text: string) {
  return text.replace(/(?:^([A-Z]))|([A-Z])/g, (match, p1, p2) => {
    if (p1) {
      return p1.toLowerCase()
    }
    return p2 ? "_" + p2.toLowerCase() : ""
  })
}
