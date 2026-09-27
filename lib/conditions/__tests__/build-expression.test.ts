import { buildExpression, isValidVariable, type VisualCondition } from "../build-expression"

const c = (variable: string, operator: string, value = ""): VisualCondition => ({ id: "x", variable, operator, value })

/** Evaluate an expression exactly like the server does (workflow-core executeConditionalNode). */
function evaluate(expression: string, inputs: Record<string, unknown>) {
  const fn = new Function(...Object.keys(inputs), `return ${expression}`)
  return Boolean(fn(...Object.values(inputs)))
}

describe("buildExpression — values are always literals", () => {
  test("empty list is `true`", () => {
    expect(buildExpression([])).toBe("true")
  })

  test.each([
    ["equals", "hello", `input1 === "hello"`],
    ["not-equals", "hello", `input1 !== "hello"`],
    ["contains", "ell", `input1.includes("ell")`],
    ["starts-with", "he", `input1.startsWith("he")`],
    ["ends-with", "lo", `input1.endsWith("lo")`],
    ["is-empty", "", `input1 === ""`],
    ["is-not-empty", "", `input1 !== ""`],
  ])("%s", (operator, value, expected) => {
    expect(buildExpression([c("input1", operator, value)])).toBe(expected)
  })

  test("numeric comparisons use numbers; non-numeric compare as strings", () => {
    expect(buildExpression([c("input1", "greater-than", "5")])).toBe("input1 > 5")
    expect(buildExpression([c("input1", "less-than", "2.5")])).toBe("input1 < 2.5")
    expect(buildExpression([c("input1", "greater-than", "abc")])).toBe(`input1 > "abc"`)
  })

  test("joins clauses with &&", () => {
    expect(buildExpression([c("input1", "equals", "a"), c("input2", "is-not-empty")])).toBe(
      `input1 === "a" && input2 !== ""`,
    )
  })
})

describe("buildExpression — injection stays data", () => {
  const INJECTION = `x') || (globalThis.__pwned = true) || ('`

  test("a quote-breaking value is escaped, not executed", () => {
    const expr = buildExpression([c("input1", "equals", INJECTION)])
    ;(globalThis as Record<string, unknown>).__pwned = false
    expect(evaluate(expr, { input1: "anything" })).toBe(false)
    expect((globalThis as Record<string, unknown>).__pwned).toBe(false)
    expect(evaluate(expr, { input1: INJECTION })).toBe(true) // it's just a string to compare with
  })

  test.each([`"; alert(1); "`, "back\\slash", "new\nline", "`${1+1}`", "</script>"])(
    "value %p round-trips as the exact string",
    (value) => {
      expect(evaluate(buildExpression([c("input1", "equals", value)]), { input1: value })).toBe(true)
    },
  )

  test("numeric check doesn't pass through code-like values", () => {
    expect(buildExpression([c("input1", "greater-than", "1 || true")])).toBe(`input1 > "1 || true"`)
  })
})

describe("variable names", () => {
  test.each(["input1", "input2", "input1.status", "input1.data.count", "_x", "$y"])("%p is valid", (v) => {
    expect(isValidVariable(v)).toBe(true)
  })

  test.each(["", "input1)", "input1 || true", "input1; fetch('x')", "a..b", "1abc", "input1['x']"])(
    "%p is rejected",
    (v) => {
      expect(isValidVariable(v)).toBe(false)
    },
  )

  test("an invalid variable fails closed: its clause becomes `false`", () => {
    const expr = buildExpression([c("input1 || true", "equals", "a")])
    expect(expr).toBe("false")
    expect(evaluate(expr, { input1: "a" })).toBe(false)
  })
})

test("unknown operators contribute no clause", () => {
  expect(buildExpression([c("input1", "no-such-op", "x"), c("input2", "is-empty")])).toBe(`input2 === ""`)
})
