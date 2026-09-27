/**
 * Safe evaluator for Conditional node expressions — NO eval, NO new Function.
 *
 * H17: conditions used to run on the server via `new Function("return " + condition)`, giving any
 * submitted workflow full access to Node globals (process.env secrets, fetch). This parser accepts
 * only a small grammar and interprets it directly:
 *
 *   expr   := or
 *   or     := and ('||' and)*
 *   and    := unary ('&&' unary)*
 *   unary  := '!' unary | cmp
 *   cmp    := value (('===' | '!==' | '==' | '!=' | '>=' | '<=' | '>' | '<') value)?
 *   value  := literal | '-' number | '(' expr ')' | path
 *   path   := inputName ('.' prop | '.' method '(' args ')')*
 *
 * - Root names must be keys of `inputs` (input1, input2, …). Unknown names are errors.
 * - Property reads use own properties only; `__proto__`, `constructor`, `prototype` are refused.
 * - Methods: includes, startsWith, endsWith, toLowerCase, toUpperCase, trim (strings; includes also
 *   on arrays). Arguments must be literals or paths. `.length` on strings and arrays.
 * - Results use JavaScript's own operators on already-evaluated values, so semantics match JS for
 *   everything the grammar allows (tested against JS in safe-evaluate.test.ts).
 */

export class ConditionSyntaxError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ConditionSyntaxError"
  }
}

const MAX_LENGTH = 2000
const MAX_DEPTH = 50
const FORBIDDEN_PROPS = new Set(["__proto__", "constructor", "prototype"])
const STRING_METHODS = new Set(["includes", "startsWith", "endsWith", "toLowerCase", "toUpperCase", "trim"])
const KEYWORDS: Record<string, unknown> = { true: true, false: false, null: null, undefined: undefined }

type Token =
  | { t: "num"; v: number }
  | { t: "str"; v: string }
  | { t: "id"; v: string }
  | { t: "op"; v: string }

const OPERATORS = ["===", "!==", "==", "!=", ">=", "<=", "&&", "||", ">", "<", "!", "(", ")", ".", ",", "-"]

function tokenize(src: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (/\s/.test(c)) {
      i++
      continue
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] ?? ""))) {
      const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(src.slice(i))!
      tokens.push({ t: "num", v: Number(m[0]) })
      i += m[0].length
      continue
    }
    if (c === "'" || c === '"') {
      let v = ""
      let j = i + 1
      for (; j < src.length && src[j] !== c; j++) {
        if (src[j] === "\\") {
          const n = src[++j]
          const map: Record<string, string> = { n: "\n", t: "\t", r: "\r", "\\": "\\", "'": "'", '"': '"', "0": "\0" }
          if (n === "u" && /^[0-9a-fA-F]{4}$/.test(src.slice(j + 1, j + 5))) {
            v += String.fromCharCode(parseInt(src.slice(j + 1, j + 5), 16))
            j += 4
          } else if (n !== undefined && n in map) {
            v += map[n]
          } else {
            throw new ConditionSyntaxError(`Unsupported escape "\\${n ?? ""}"`)
          }
        } else {
          v += src[j]
        }
      }
      if (src[j] !== c) throw new ConditionSyntaxError("Unterminated string")
      tokens.push({ t: "str", v })
      i = j + 1
      continue
    }
    if (/[A-Za-z_$]/.test(c)) {
      const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i))!
      tokens.push({ t: "id", v: m[0] })
      i += m[0].length
      continue
    }
    const op = OPERATORS.find((o) => src.startsWith(o, i))
    if (!op) throw new ConditionSyntaxError(`Unexpected character "${c}"`)
    tokens.push({ t: "op", v: op })
    i += op.length
  }
  return tokens
}

// The parser builds closures; nothing runs until evaluation, and short-circuiting is preserved.
type Thunk = () => unknown

export function evaluateCondition(expression: string, inputs: Record<string, unknown>): boolean {
  if (typeof expression !== "string") throw new ConditionSyntaxError("Condition must be a string")
  if (expression.length > MAX_LENGTH) throw new ConditionSyntaxError(`Condition longer than ${MAX_LENGTH} characters`)
  const tokens = tokenize(expression)
  let pos = 0
  let depth = 0

  const peek = () => tokens[pos]
  const isOp = (v: string) => peek()?.t === "op" && peek()!.v === v
  const expectOp = (v: string) => {
    if (!isOp(v)) throw new ConditionSyntaxError(`Expected "${v}"`)
    pos++
  }
  const nest = <T>(fn: () => T): T => {
    if (++depth > MAX_DEPTH) throw new ConditionSyntaxError("Condition is nested too deeply")
    try {
      return fn()
    } finally {
      depth--
    }
  }

  const parseOr = (): Thunk =>
    nest(() => {
      let left = parseAnd()
      while (isOp("||")) {
        pos++
        const l = left
        const r = parseAnd()
        left = () => l() || r()
      }
      return left
    })

  const parseAnd = (): Thunk => {
    let left = parseUnary()
    while (isOp("&&")) {
      pos++
      const l = left
      const r = parseUnary()
      left = () => l() && r()
    }
    return left
  }

  const parseUnary = (): Thunk => {
    if (isOp("!")) {
      pos++
      const inner = nest(parseUnary)
      return () => !inner()
    }
    return parseComparison()
  }

  const CMP = ["===", "!==", "==", "!=", ">=", "<=", ">", "<"]
  const parseComparison = (): Thunk => {
    const left = parseValue()
    const tok = peek()
    if (tok?.t === "op" && CMP.includes(tok.v)) {
      pos++
      const right = parseValue()
      const op = tok.v
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const a: any = left()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = right()
        switch (op) {
          case "===":
            return a === b
          case "!==":
            return a !== b
          case "==":
            return a == b
          case "!=":
            return a != b
          case ">=":
            return a >= b
          case "<=":
            return a <= b
          case ">":
            return a > b
          default:
            return a < b
        }
      }
    }
    return left
  }

  const parseValue = (): Thunk => {
    const tok = peek()
    if (!tok) throw new ConditionSyntaxError("Unexpected end of condition")
    if (tok.t === "num" || tok.t === "str") {
      pos++
      return () => tok.v
    }
    if (tok.t === "op" && tok.v === "-" && tokens[pos + 1]?.t === "num") {
      const n = tokens[pos + 1] as { v: number }
      pos += 2
      return () => -n.v
    }
    if (tok.t === "op" && tok.v === "(") {
      pos++
      const inner = parseOr()
      expectOp(")")
      return inner
    }
    if (tok.t === "id") {
      if (tok.v in KEYWORDS) {
        pos++
        return () => KEYWORDS[tok.v]
      }
      return parsePath()
    }
    throw new ConditionSyntaxError(`Unexpected "${tok.v}"`)
  }

  const parsePath = (): Thunk => {
    const root = (peek() as { v: string }).v
    if (!Object.prototype.hasOwnProperty.call(inputs, root)) throw new ConditionSyntaxError(`Unknown variable "${root}"`)
    pos++
    let get: Thunk = () => inputs[root]
    while (isOp(".")) {
      pos++
      const name = peek()
      if (name?.t !== "id") throw new ConditionSyntaxError("Expected a property name after '.'")
      if (FORBIDDEN_PROPS.has(name.v)) throw new ConditionSyntaxError(`Property "${name.v}" is not allowed`)
      pos++
      const target = get
      if (isOp("(")) {
        if (!STRING_METHODS.has(name.v)) throw new ConditionSyntaxError(`Method "${name.v}" is not allowed`)
        pos++
        const args: Thunk[] = []
        if (!isOp(")")) {
          do {
            const a = peek()
            if (a?.t !== "num" && a?.t !== "str" && a?.t !== "id") throw new ConditionSyntaxError("Method arguments must be values")
            args.push(parseValue())
          } while (isOp(",") && ++pos)
        }
        expectOp(")")
        const method = name.v
        get = () => {
          const recv = target()
          const vals = args.map((a) => a())
          if (typeof recv === "string") {
            if (method === "toLowerCase") return recv.toLowerCase()
            if (method === "toUpperCase") return recv.toUpperCase()
            if (method === "trim") return recv.trim()
            if (vals.some((v) => typeof v !== "string" && typeof v !== "number")) return false
            const s = String(vals[0] ?? "")
            if (method === "includes") return recv.includes(s)
            if (method === "startsWith") return recv.startsWith(s)
            return recv.endsWith(s)
          }
          if (Array.isArray(recv) && method === "includes") return recv.includes(vals[0])
          throw new ConditionSyntaxError(`"${method}" needs a string`)
        }
      } else {
        const prop = name.v
        get = () => {
          const obj = target()
          if (prop === "length" && (typeof obj === "string" || Array.isArray(obj))) return obj.length
          if (obj !== null && typeof obj === "object" && Object.prototype.hasOwnProperty.call(obj, prop)) {
            return (obj as Record<string, unknown>)[prop]
          }
          if (obj === null || obj === undefined) throw new ConditionSyntaxError(`Cannot read "${prop}" of ${obj}`)
          return undefined
        }
      }
    }
    return get
  }

  const program = parseOr()
  if (pos !== tokens.length) throw new ConditionSyntaxError(`Unexpected "${(peek() as { v: unknown }).v}"`)
  return Boolean(program())
}
