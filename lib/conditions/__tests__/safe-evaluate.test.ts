import { evaluateCondition, ConditionSyntaxError } from "../safe-evaluate"
import { buildExpression, type VisualCondition } from "../build-expression"
import { getSecurityTemplates } from "@/lib/security-templates"
import { GITHUB_SCANNER_NODES } from "@/lib/templates/github-scanner"

/** What JavaScript would say (test-only reference — the product never evaluates code). */
const js = (expr: string, inputs: Record<string, unknown>) =>
  Boolean(new Function(...Object.keys(inputs), `return ${expr}`)(...Object.values(inputs)))

describe("evaluateCondition — matches JavaScript on the supported grammar", () => {
  const inputs = {
    input1: { score: 85, verified: true, severity_level: "HIGH", tags: ["a", "b"], name: "Hello World" },
    input2: "hello",
    input5: { combined_risk_score: 90 },
    input6: { lateral_movement_risk: "LOW" },
  }

  test.each([
    "input1.score >= 80",
    "input1.score < 80",
    "input1.verified === true",
    "input1.severity_level === 'CRITICAL' || input1.severity_level === 'HIGH'",
    "input5.combined_risk_score > 85 || input6.lateral_movement_risk === 'CRITICAL'",
    "input2 === \"hello\"",
    "input2 !== 'x' && input1.score > 50",
    "!(input1.score > 90)",
    "input2.includes(\"ell\")",
    "input2.startsWith('he') && input2.endsWith('lo')",
    "input1.name.toLowerCase() === 'hello world'",
    "input1.tags.includes('b')",
    "input1.tags.length === 2",
    "input2.length > 3",
    "input1.missing === undefined",
    "input1.score == '85'",
    "input1.score != 84",
    "(input1.score > 1 && input2 === 'hello') || false",
    "true",
    "null === null",
    "-5 < input1.score",
    "input2 === \"q\\\"uote\"",
  ])("%s", (expr) => {
    expect(evaluateCondition(expr, inputs)).toBe(js(expr, inputs))
  })

  test("short-circuits like JavaScript (no error on the untaken side)", () => {
    expect(evaluateCondition("input3 && input3.x === 1", { input3: null })).toBe(false)
    expect(evaluateCondition("input3 || input3.x === 1", { input3: "yes" })).toBe(true)
  })
})

describe("every condition shipped in a template is supported", () => {
  const conditions = [
    ...getSecurityTemplates().flatMap((t) => t.nodes),
    ...GITHUB_SCANNER_NODES,
  ]
    .filter((n) => n.type === "conditional")
    .map((n) => String((n.data as { condition?: string }).condition ?? "true"))

  test.each(conditions)("%s", (expr) => {
    expect(() => evaluateCondition(expr, { input1: {}, input5: {}, input6: {} })).not.toThrow(ConditionSyntaxError)
  })
})

describe("every visual-builder expression is supported", () => {
  const ops = ["equals", "not-equals", "contains", "starts-with", "ends-with", "greater-than", "less-than", "is-empty", "is-not-empty"]
  test.each(ops)("%s", (operator) => {
    const cond: VisualCondition = { id: "1", variable: "input1", operator, value: `it's "5"` }
    const expr = buildExpression([cond])
    expect(evaluateCondition(expr, { input1: "abc" })).toBe(js(expr, { input1: "abc" }))
  })
})

describe("evaluateCondition — nothing outside the grammar runs", () => {
  test.each([
    "process.env",
    "globalThis",
    "this",
    "fetch('https://evil.example')",
    "input1.constructor",
    "input1.__proto__",
    "input1.constructor.constructor('return process')()",
    "input1['score']",
    "input1.toString()",
    "(() => true)()",
    "input1 = 5",
    "`${process}`",
    "new Function('return 1')()",
    "require('fs')",
    "input1.score > 1; process.exit()",
    "undefinedVariable === 1",
    "input1.valueOf()",
    "input2.includes(process)",
  ])("rejects %s", (expr) => {
    expect(() => evaluateCondition(expr, { input1: { score: 1 }, input2: "x" })).toThrow()
  })

  test("rejects over-long expressions", () => {
    expect(() => evaluateCondition("true && ".repeat(400) + "true", {})).toThrow(ConditionSyntaxError)
  })

  test("property access only reads own properties", () => {
    const inputs = { input1: Object.create({ inherited: true }) }
    expect(evaluateCondition("input1.inherited === undefined", inputs)).toBe(true)
  })
})

describe("evaluateCondition — edge cases and error paths", () => {
  const inputs = { input1: { a: null, s: "  MiXed  ", n: 3 }, input2: "héllo", input3: [1, 2] }

  test.each([
    ["'a\\nb' === 'a\\nb'", true],
    ["'\\u0041' === 'A'", true],
    ["input2.includes('\\u00e9')", true], // escape inside a method argument (é)
    ["input1.s.trim() === 'MiXed'", true],
    ["input1.s.toUpperCase().includes('MIXED')", true],
    [".5 < 1", true],
    ["1e3 === 1000", true],
    ["input3.includes(2)", true],
    ["input2.startsWith(1)", false],
    ["input1.n.includes === undefined", true],
  ])("%s → %s", (expr, expected) => {
    expect(evaluateCondition(expr as string, inputs)).toBe(expected)
  })

  test.each([
    ["'unterminated", /Unterminated string/],
    ["'bad \\q escape'", /Unsupported escape/],
    ["input1.n.includes('x')", /needs a string/],
    ["input1.a.b === 1", /Cannot read "b" of null/],
    ["(input1.n > 1", /Expected "\)"/],
    ["input2.includes(!input2)", /arguments must be values/],
    ["input1.", /property name/],
    ["input1.n >", /Unexpected end/],
    ["input1.n > 1 )", /Unexpected "\)"/],
    ["@", /Unexpected character/],
    ["!".repeat(60) + "true", /nested too deeply/],
  ])("%s → error %s", (expr, message) => {
    expect(() => evaluateCondition(expr as string, inputs)).toThrow(message as RegExp)
  })

  test("non-string conditions are rejected", () => {
    expect(() => evaluateCondition(42 as unknown as string, {})).toThrow(ConditionSyntaxError)
  })
})
