declare class ClipboardItem {
  constructor(data: { [mimeType: string]: Blob })
}

export const Clipboard = {
  copyAsHtml(html: string): Promise<void> {
    const blobHtml = new Blob([html], { type: "text/html" })
    const clipboardData = [new ClipboardItem({ "text/html": blobHtml })]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clipboardApi: any = window.navigator.clipboard
    return clipboardApi.write(clipboardData)
  },
}
