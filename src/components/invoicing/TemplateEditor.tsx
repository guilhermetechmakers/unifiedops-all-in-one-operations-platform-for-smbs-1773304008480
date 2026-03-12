import { useState, useMemo, useCallback } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const PLACEHOLDERS = [
  '{{customer_name}}',
  '{{invoice_number}}',
  '{{invoice_date}}',
  '{{due_date}}',
  '{{subtotal}}',
  '{{taxes}}',
  '{{total}}',
  '{{currency}}',
  '{{line_items}}',
] as const

export interface TemplateEditorProps {
  html: string
  onChange: (html: string) => void
  variables?: Record<string, string>
  className?: string
  disabled?: boolean
}

function replaceVariables(html: string, vars: Record<string, string>): string {
  let out = html
  for (const [key, value] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), value)
  }
  return out
}

export function TemplateEditor({
  html,
  onChange,
  variables = {},
  className,
  disabled = false,
}: TemplateEditorProps) {
  const [localHtml, setLocalHtml] = useState(html)
  const safeVariables = useMemo(
    () => ({
      customer_name: variables.customer_name ?? 'Acme Corp',
      invoice_number: variables.invoice_number ?? 'INV-0001',
      invoice_date: variables.invoice_date ?? new Date().toISOString().slice(0, 10),
      due_date: variables.due_date ?? new Date().toISOString().slice(0, 10),
      subtotal: variables.subtotal ?? '0.00',
      taxes: variables.taxes ?? '0.00',
      total: variables.total ?? '0.00',
      currency: variables.currency ?? 'USD',
      line_items: variables.line_items ?? '<tr><td>Sample item</td><td>1</td><td>100.00</td></tr>',
      ...variables,
    }),
    [variables]
  )
  const previewHtml = useMemo(
    () => replaceVariables(localHtml, safeVariables),
    [localHtml, safeVariables]
  )

  const handleChange = useCallback(
    (value: string) => {
      setLocalHtml(value)
      onChange(value)
    },
    [onChange]
  )

  const insertPlaceholder = useCallback(
    (placeholder: string) => {
      const next = localHtml + placeholder
      setLocalHtml(next)
      onChange(next)
    },
    [localHtml, onChange]
  )

  return (
    <div className={cn('space-y-3', className)}>
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit template</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-3 space-y-2">
          <Label className="text-muted-foreground text-xs">Placeholders (click to insert)</Label>
          <div className="flex flex-wrap gap-2">
            {PLACEHOLDERS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => insertPlaceholder(p)}
                disabled={disabled}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {p}
              </button>
            ))}
          </div>
          <Textarea
            value={localHtml}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder="<html>... {{customer_name}} ...</html>"
            className="min-h-[240px] font-mono text-sm"
            aria-label="HTML template"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-3">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
              Rendered preview (placeholders replaced)
            </div>
            <iframe
              title="Template preview"
              srcDoc={previewHtml}
              className="h-[360px] w-full border-0 bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
