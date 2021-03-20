import { getFormatterByName, Formatters, formatters } from "./formatters"

export interface Hyperlink {
  label: string
  href: string
}

export interface Cell {
  [name: string]: unknown
  text?: string
  html?: string
  indent?: string
  color?: string
  background?: string
  bold?: boolean
  underline?: boolean
  group?: Cell[]
  format?: string
  hyperlink?: Hyperlink
  border: boolean
}

declare global {
  interface JQuery {
    office(method: string | Row[]): JQuery
  }
}

export interface CallableCell {
  (formatters: Formatters, $: JQueryStatic, parent: JQuery): void
}

export type Row = (Cell | CallableCell)[]

export const Converter = {
  convert: ($: JQueryStatic, data: Row[], header?: Row): JQuery => {
    const root = $("<div><table></table></div>")
    const table = root.find("table")
    Converter.overwriteTable(table, data, header)
    return root
  },

  overwriteTable(table: JQuery, data: Row[], header?: Row): void {
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

  apply: (data: Cell | CallableCell, $: JQueryStatic, parent: JQuery): void => {
    if (typeof data === "function") {
      data(formatters, $, parent)
      return
    }
    for (const attribute in data) {
      const formatter = getFormatterByName(attribute)
      if (formatter === null) {
        continue
      }
      formatter(data[attribute], $, parent, data)
    }
  },

  register: ($: JQueryStatic): JQueryStatic => {
    $.fn.office = function (
      method: string | Row[],
      param?: Row
    ): JQuery<HTMLElement> {
      if (typeof method === "object") {
        return Converter.convert($, method, param)
      } else if (typeof method === "string") {
        if (typeof formatters[method] !== "undefined") {
          formatters[method](param, $, <any>$, {})
        }
      }
      return this
    }
    return $
  },
}
