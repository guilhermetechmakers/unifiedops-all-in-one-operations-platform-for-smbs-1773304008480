import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { InvoiceLineItem } from '@/types/invoicing'
import { Plus, Trash2 } from 'lucide-react'

export interface InvoiceLineItemEditorProps {
  items: InvoiceLineItem[]
  onChange: (items: InvoiceLineItem[]) => void
  currency?: string
  disabled?: boolean
  className?: string
}

function computeLineTotal(item: {
  quantity: number
  unit_price_cents: number
  tax_rate: number
  discount_cents?: number
}): number {
  const subtotal = Math.round(Number(item.quantity) * item.unit_price_cents)
  const discount = item.discount_cents ?? 0
  const afterDiscount = subtotal - discount
  const tax = Math.round((afterDiscount * Number(item.tax_rate)) / 100)
  return afterDiscount + tax
}

function formatCents(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

const defaultItem: Omit<InvoiceLineItem, 'line_total_cents'> = {
  description: '',
  quantity: 1,
  unit_price_cents: 0,
  tax_rate: 0,
  discount_cents: 0,
}

export function InvoiceLineItemEditor({
  items,
  onChange,
  currency = 'USD',
  disabled = false,
  className,
}: InvoiceLineItemEditorProps) {
  const list = items ?? []
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const updateItem = useCallback(
    (index: number, patch: Partial<InvoiceLineItem>) => {
      const next = [...list]
      const current = next[index] ?? { ...defaultItem, line_total_cents: 0 }
      const merged = { ...current, ...patch }
      merged.line_total_cents = computeLineTotal(merged)
      next[index] = merged
      onChange(next)
    },
    [list, onChange]
  )

  const addRow = useCallback(() => {
    const newItem: InvoiceLineItem = {
      ...defaultItem,
      line_total_cents: 0,
    }
    onChange([...list, newItem])
    setFocusedIndex(list.length)
  }, [list, onChange])

  const removeRow = useCallback(
    (index: number) => {
      const next = list.filter((_, i) => i !== index)
      onChange(next)
      setFocusedIndex(null)
    },
    [list, onChange]
  )

  const subtotalCents = list.reduce((sum, i) => {
    const sub = Math.round(Number(i.quantity) * i.unit_price_cents) - (i.discount_cents ?? 0)
    return sum + sub
  }, 0)
  const taxesCents = list.reduce((sum, i) => {
    const afterDiscount = Math.round(Number(i.quantity) * i.unit_price_cents) - (i.discount_cents ?? 0)
    return sum + Math.round((afterDiscount * Number(i.tax_rate)) / 100)
  }, 0)
  const totalCents = subtotalCents + taxesCents

  return (
    <div className={cn('space-y-4', className)}>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium text-foreground">Description</th>
              <th className="w-24 px-4 py-3 text-right font-medium text-foreground">Qty</th>
              <th className="w-32 px-4 py-3 text-right font-medium text-foreground">Unit price</th>
              <th className="w-24 px-4 py-3 text-right font-medium text-foreground">Tax %</th>
              <th className="w-28 px-4 py-3 text-right font-medium text-foreground">Discount</th>
              <th className="w-32 px-4 py-3 text-right font-medium text-foreground">Amount</th>
              {!disabled && <th className="w-12 px-2 py-3" aria-label="Actions" />}
            </tr>
          </thead>
          <tbody>
            {(list.length === 0 ? [{ ...defaultItem, line_total_cents: 0 }] : list).map((item, index) => (
              <tr
                key={index}
                className={cn(
                  'border-b border-border transition-colors',
                  focusedIndex === index && 'bg-accent/5'
                )}
              >
                <td className="px-4 py-2">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    placeholder="Item description"
                    disabled={disabled}
                    className="border-0 bg-transparent shadow-none focus-visible:ring-2"
                    aria-label="Line item description"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <Input
                    type="number"
                    min={0.0001}
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    disabled={disabled}
                    className="text-right border-0 bg-transparent shadow-none focus-visible:ring-2 w-20"
                    aria-label="Quantity"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unit_price_cents / 100}
                    onChange={(e) =>
                      updateItem(index, { unit_price_cents: Math.round(parseFloat(e.target.value || '0') * 100) })
                    }
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    disabled={disabled}
                    className="text-right border-0 bg-transparent shadow-none focus-visible:ring-2 w-24"
                    aria-label="Unit price"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={item.tax_rate}
                    onChange={(e) => updateItem(index, { tax_rate: parseFloat(e.target.value || '0') })}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    disabled={disabled}
                    className="text-right border-0 bg-transparent shadow-none focus-visible:ring-2 w-16"
                    aria-label="Tax rate %"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={(item.discount_cents ?? 0) / 100}
                    onChange={(e) =>
                      updateItem(index, { discount_cents: Math.round(parseFloat(e.target.value || '0') * 100) })
                    }
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    disabled={disabled}
                    className="text-right border-0 bg-transparent shadow-none focus-visible:ring-2 w-20"
                    aria-label="Discount"
                  />
                </td>
                <td className="px-4 py-2 text-right font-medium tabular-nums text-foreground">
                  {formatCents(item.line_total_cents ?? 0, currency)}
                </td>
                {!disabled && (
                  <td className="px-2 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(index)}
                      disabled={list.length <= 1}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      aria-label="Remove line item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!disabled && (
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-2">
          <Plus className="h-4 w-4" />
          Add line item
        </Button>
      )}
      <div className="flex flex-col gap-1 border-t border-border pt-4 text-right">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatCents(subtotalCents, currency)}</span>
        </div>
        {taxesCents > 0 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tax</span>
            <span className="tabular-nums">{formatCents(taxesCents, currency)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold text-foreground">
          <span>Total</span>
          <span className="tabular-nums">{formatCents(totalCents, currency)}</span>
        </div>
      </div>
    </div>
  )
}
