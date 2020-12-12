export const heapMeasurer = (
  _malloc: EmscriptenModule['_malloc'],
  _free: EmscriptenModule['_free']
) =>
  (): number => {
    const ptrs: number[] = []
    let total = 0
    const counts: { [ix: number]: number } = {}
    let count = 0
    let size = 1024 * 1024
    while (size >= 1) {
      try {
        ptrs.push(_malloc(size))
        total += size
        count++
      } catch (e) {
        counts[size] = count
        size >>= 1
        count = 0
      }
    }
    try {
      for (const ptr of ptrs) {
        _free(ptr)
      }
    } catch (e) {
      console.error(e)
    }
    for (const s in counts) {
      console.log(`${counts[s]} of size ${s}`)
    }
    return total
  }
