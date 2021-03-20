/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cell, Converter, Hyperlink } from "../Converter"

interface Formatter<T> {
  (
    data: T,
    root: JQueryStatic,
    cell: JQuery,
    parent: { [name: string]: unknown }
  ): void
}

export interface Formatters {
  [name: string]: Formatter<any>
  text: Formatter<string>
  html: Formatter<string>
  indent: Formatter<string>
  color: Formatter<string>
  background: Formatter<string>
  bold: Formatter<boolean>
  underline: Formatter<boolean>
  group: Formatter<Cell[]>
  format: Formatter<string>
  hyperlink: Formatter<Hyperlink>
  border: Formatter<boolean>
  borderTop: Formatter<boolean>
  borderRight: Formatter<boolean>
  borderBottom: Formatter<boolean>
  borderLeft: Formatter<boolean>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatters: Formatters = {
  text: (data, _$, cell): void => {
    cell.text(data)
  },
  html: (data, _$, cell): void => {
    cell.html(data)
  },

  indent: (data, _$, cell): void => {
    cell.css("mso-char-indent-count", data)
    cell.css("padding-left", "12px")
  },

  color: (data, $, cell): void => {
    cell.css("color", data)
    cell.attr("color", data)
  },

  background: (data: string, $, cell): void => {
    cell.css("background", data)
    cell.css("mso-pattern", data + " none")
  },

  bold: (data, $, cell): void => {
    if (data) {
      cell.css("font-weight", "700")
    } else {
      cell.css("font-weight", "normal")
    }
  },
  underline: (data, $, cell): void => {
    if (data) {
      cell.css("text-decoration", "underline")
      cell.css("text-underline-style", "single")
    } else {
      cell.css("text-decoration", "none")
      cell.css("text-underline-style", "")
    }
  },
  underlineDouble: (data, $, cell): void => {
    if (data) {
      cell.css("text-decoration", "underline")
      cell.css("text-underline-style", "double")
    } else {
      cell.css("text-decoration", "none")
      cell.css("text-underline-style", "")
    }
  },
  group: (data, $, cell): void => {
    data.forEach((item: Cell) => {
      const span = $("<span>")
      cell.append(span)
      Converter.apply(item, $, span)
    })
  },
  format: (data, $, cell): void => {
    cell.css("mso-number-format", data)
  },
  hyperlink: (data, $, cell): void => {
    const anchor = $("<a>")
    anchor.text(data.label)
    anchor.attr("href", data.href)
    anchor.appendTo(cell)
  },
  border: (data, $, cell, parent): void => {
    formatters.borderTop(data, $, cell, parent)
    formatters.borderRight(data, $, cell, parent)
    formatters.borderBottom(data, $, cell, parent)
    formatters.borderLeft(data, $, cell, parent)
  },
  borderTop: (data, $, cell): void => {
    if (data) {
      cell.css("border-top", "0.5pt solid black")
    } else {
      cell.css("border-top", "none")
    }
  },
  borderRight: (data, $, cell): void => {
    if (data) {
      cell.css("border-right", "0.5pt solid black")
    } else {
      cell.css("border-right", "none")
    }
  },
  borderBottom: (data, $, cell): void => {
    if (data) {
      cell.css("border-bottom", "0.5pt solid black")
    } else {
      cell.css("border-bottom", "none")
    }
  },
  borderLeft: (data, $, cell): void => {
    if (data) {
      cell.css("border-left", "0.5pt solid black")
    } else {
      cell.css("border-left", "none")
    }
  },
}

export function getFormatterByName(name: string): null | Formatter<any> {
  if (typeof formatters[name] !== "undefined") {
    return formatters[name]
  }
  return null
}
