/**
 * Turns the Conditional node's visual builder rows into a JavaScript expression.
 *
 * The expression is later evaluated with `new Function(...inputs, "return " + expr)` — on the
 * server during execution, and in a sandbox when the user clicks "Test". User-typed VALUES
 * therefore must never become code: they are emitted as JSON string literals (or finite numbers
 * for > / <). Previously values were pasted inside single quotes, so `x') || evil() || ('` broke
 * out of the string — a code-injection path for anyone sharing a workflow.
 *
 * VARIABLES are a free-text field too; only identifier paths (e.g. `input1.status`) are allowed.
 * An invalid variable fails closed: its clause becomes `false`, so a malformed row can never make
 * the condition pass more often.
 */

export type VisualCondition = {
  id: string
  variable: string
  operator: string
  value: string
}

const IDENTIFIER_PATH = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/

export function isValidVariable(variable: string): boolean {
  return IDENTIFIER_PATH.test(variable)
}

const str = (value: string) => JSON.stringify(value)
const numOrStr = (value: string) => {
  const trimmed = value.trim()
  return trimmed !== "" && Number.isFinite(Number(trimmed)) ? String(Number(trimmed)) : str(value)
}

function clause({ variable: v, operator, value }: VisualCondition): string {
  if (!isValidVariable(v)) return "false"
  switch (operator) {
    case "equals":
      return `${v} === ${str(value)}`
    case "not-equals":
      return `${v} !== ${str(value)}`
    case "contains":
      return `${v}.includes(${str(value)})`
    case "starts-with":
      return `${v}.startsWith(${str(value)})`
    case "ends-with":
      return `${v}.endsWith(${str(value)})`
    case "greater-than":
      return `${v} > ${numOrStr(value)}`
    case "less-than":
      return `${v} < ${numOrStr(value)}`
    case "is-empty":
      return `${v} === ""`
    case "is-not-empty":
      return `${v} !== ""`
    default:
      return ""
  }
}

export function buildExpression(conditions: VisualCondition[]): string {
  if (conditions.length === 0) return "true"
  return conditions.map(clause).filter(Boolean).join(" && ")
}
