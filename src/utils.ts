export const strChunk = (str: string, size: number): string[] => {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substring(o, o + size)
    }

    return chunks
}

export const download = (content: string, type: string, filename: string) => {
    const blob = new Blob([content], {type})
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    link.click()
}
