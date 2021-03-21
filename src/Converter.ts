import { getFormatterByName, Formatters, formatters } from "./Formatters"

import cheerio from "cheerio"

export interface Hyperlink {
  label: string
  href: string
}

export interface Cell {
  [name: string]: unknown
  text?: string
  html?: string
  indent?: number
  colSpan?: number
  rowSpan?: number
  color?: string
  background?: string
  bold?: boolean
  underline?: boolean
  group?: Cell[]
  format?: string
  hyperlink?: Hyperlink
  border?: boolean
}

export interface CallableCell {
  (formatters: Formatters, $: cheerio.Root, parent: cheerio.Cheerio): void
}

export type Row = (Cell | CallableCell)[]

export const Converter = {
  convert: (data: Row[], header?: Row): cheerio.Root => {
    const $ = cheerio.load("<table></table>")
    const table = $("table")
    Converter.overwriteTable(table, $, data, header)
    return $
  },

  overwriteTable(
    table: cheerio.Cheerio,
    $: cheerio.Root,
    data: Row[],
    header?: Row
  ): void {
    table.html("")
    if (typeof header !== "undefined") {
      const tr = $("<tr>")
      tr.appendTo(table)

      header.forEach((cell) => {
        const td = $("<th>")
        td.appendTo(tr)

        Converter.apply(cell, $, td)
      })
    }

    data.forEach((row) => {
      const tr = $("<tr>")
      tr.appendTo(table)

      row.forEach((cell) => {
        const td = $("<td>")
        td.appendTo(tr)

        Converter.apply(cell, $, td)
      })
    })
  },

  apply: (
    data: Cell | CallableCell,
    $: cheerio.Root,
    parent: cheerio.Cheerio
  ): void => {
    if (typeof data === "function") {
      data(formatters, $, parent)
      return
    }
    for (const attribute in data) {
      if (typeof data[attribute] === "undefined") {
        continue
      }
      const formatter = getFormatterByName(attribute)
      if (formatter === null) {
        continue
      }
      formatter(data[attribute], $, parent, data)
    }
  },
}
