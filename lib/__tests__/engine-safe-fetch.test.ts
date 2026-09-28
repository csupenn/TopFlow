/**
 * @jest-environment node
 */

/**
 * The HTTP Request node must send user-supplied URLs through safeFetch (DNS answers checked at connection
 * time, redirects re-checked), not the global fetch, which resolves and follows redirects unchecked.
 */
jest.mock("../security/safe-fetch", () => ({
  safeFetch: jest.fn(async () => new Response(JSON.stringify({ via: "safeFetch" }), { headers: { "Content-Type": "application/json" } })),
}))

import { TopFlowExecutionEngine } from "../topflow-execution-engine"
import { safeFetch } from "../security/safe-fetch"

describe("HTTP Request node → safeFetch", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.spyOn(global, "fetch").mockImplementation(async () => {
      throw new Error("global fetch must not be used for user-supplied URLs")
    })
  })
  afterEach(() => jest.restoreAllMocks())

  test("a user URL goes through safeFetch with the node's method and headers", async () => {
    const engine = new TopFlowExecutionEngine({ workflowId: "custom" })
    const node = {
      id: "h",
      type: "httpRequest",
      position: { x: 0, y: 0 },
      data: { url: "https://api.example.com/items/$input1", method: "GET", headers: { "X-Test": "1" } },
    }
    const out = await (engine as any).executeHttpRequestNode(node, { input1: "42" })
    expect(out).toEqual({ via: "safeFetch" })
    expect(safeFetch).toHaveBeenCalledWith(
      "https://api.example.com/items/42",
      expect.objectContaining({ method: "GET", headers: expect.objectContaining({ "X-Test": "1" }) }),
    )
  })
})
