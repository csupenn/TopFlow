"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, TestTube } from "lucide-react"
import { buildExpression as buildConditionExpression, type VisualCondition } from "@/lib/conditions/build-expression"
import { evaluateCondition } from "@/lib/conditions/safe-evaluate"

type Condition = VisualCondition

type ConditionalBuilderProps = {
  value: string
  onChange: (value: string) => void
}

const OPERATORS = [
  { value: "equals", label: "equals", symbol: "===" },
  { value: "not-equals", label: "not equals", symbol: "!==" },
  { value: "contains", label: "contains", symbol: ".includes()" },
  { value: "starts-with", label: "starts with", symbol: ".startsWith()" },
  { value: "ends-with", label: "ends with", symbol: ".endsWith()" },
  { value: "greater-than", label: "greater than", symbol: ">" },
  { value: "less-than", label: "less than", symbol: "<" },
  { value: "is-empty", label: "is empty", symbol: "=== ''" },
  { value: "is-not-empty", label: "is not empty", symbol: "!== ''" },
]

export function ConditionalBuilder({ value, onChange }: ConditionalBuilderProps) {
  const [mode, setMode] = useState<"visual" | "code">("visual")
  const [conditions, setConditions] = useState<Condition[]>([
    { id: "1", variable: "input1", operator: "equals", value: "" },
  ])
  const [testVariable, setTestVariable] = useState("")
  const [testResult, setTestResult] = useState<boolean | null>(null)
  const [testError, setTestError] = useState<string | null>(null)

  // Values are emitted as literals and variables validated — see lib/conditions/build-expression.ts
  const buildExpression = () => buildConditionExpression(conditions)

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now().toString(), variable: "input1", operator: "equals", value: "" }])
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleApply = () => {
    const expression = mode === "visual" ? buildExpression() : value
    onChange(expression)
  }

  // Same safe evaluator the server uses (lib/conditions/safe-evaluate.ts) — no eval anywhere, and
  // "Test" can never disagree with a real run.
  const testCondition = () => {
    const expression = mode === "visual" ? buildExpression() : value
    setTestError(null)
    try {
      setTestResult(evaluateCondition(expression, { input1: testVariable, input2: "", input3: "" }))
    } catch (error) {
      setTestResult(null)
      setTestError(error instanceof Error ? error.message : "evaluation failed")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "visual" | "code")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">Visual Builder</TabsTrigger>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <Card key={condition.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {index > 0 && <span className="text-xs font-medium text-muted-foreground">AND</span>}
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-3">
                      <Input
                        value={condition.variable}
                        onChange={(e) => updateCondition(condition.id, "variable", e.target.value)}
                        placeholder="input1"
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="col-span-4">
                      <Select
                        value={condition.operator}
                        onValueChange={(v) => updateCondition(condition.id, "operator", v)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {!["is-empty", "is-not-empty"].includes(condition.operator) && (
                      <div className="col-span-4">
                        <Input
                          value={condition.value}
                          onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                          placeholder="value"
                          className="text-sm"
                        />
                      </div>
                    )}

                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCondition(condition.id)}
                        disabled={conditions.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-mono bg-secondary p-2 rounded">
                    Preview: {(() => {
                      const op = OPERATORS.find((o) => o.value === condition.operator)
                      if (!op) return ""

                      if (["is-empty", "is-not-empty"].includes(condition.operator)) {
                        return `If ${condition.variable} ${op.label}`
                      }
                      return `If ${condition.variable} ${op.label} '${condition.value}'`
                    })()}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button onClick={addCondition} variant="outline" size="sm" className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>

          <Card className="p-4 bg-secondary/30">
            <Label className="text-xs font-medium mb-2 block">Generated Expression:</Label>
            <code className="text-xs font-mono block bg-background p-2 rounded">{buildExpression()}</code>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <div className="space-y-2">
            <Label>JavaScript Expression</Label>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="input1 === 'US' && input2 > 100"
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use input1, input2, etc. to reference node outputs. Expression should return true or false.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-4 bg-blue-500/5 border-blue-500/20">
        <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          Test Condition
        </Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={testVariable}
              onChange={(e) => setTestVariable(e.target.value)}
              placeholder="Test value for input1"
              className="text-sm"
            />
            <Button onClick={testCondition} size="sm">
              Test
            </Button>
          </div>

          {testError && (
            <div className="p-3 rounded text-sm font-medium bg-yellow-500/10 text-yellow-700" role="alert">
              Could not evaluate: {testError}
            </div>
          )}

          {testResult !== null && (
            <div
              className={`p-3 rounded text-sm font-medium ${testResult ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
            >
              {testResult ? "✓ TRUE - Would execute right branch" : "✗ FALSE - Would execute left branch"}
            </div>
          )}
        </div>
      </Card>

      <Button onClick={handleApply} className="w-full">
        Apply Condition
      </Button>
    </div>
  )
}
