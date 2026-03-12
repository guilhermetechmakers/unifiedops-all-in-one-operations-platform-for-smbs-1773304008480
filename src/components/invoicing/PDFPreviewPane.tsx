import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Download, Loader2, FileText } from 'lucide-react'

export interface PDFPreviewPaneProps {
  /** When provided, fetches PDF/HTML from API (e.g. invoice id). */
  invoiceId?: string | null
  /** When provided, renders this HTML directly (e.g. from template preview). */
  htmlContent?: string | null
  onFetchPdf?: (invoiceId: string) => Promise<{ url?: string; html?: string; error?: string }>
  className?: string
}

export function PDFPreviewPane({
  invoiceId,
  htmlContent,
  onFetchPdf,
  className,
}: PDFPreviewPaneProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)

  const fetchPdf = useCallback(async () => {
    if (!invoiceId || !onFetchPdf) return
    setLoading(true)
    setError(null)
    try {
      const result = await onFetchPdf(invoiceId)
      if (result.error) {
        setError(result.error)
        setPreviewUrl(null)
        setPreviewHtml(null)
      } else {
        if (result.url) setPreviewUrl(result.url)
        if (result.html) setPreviewHtml(result.html)
      }
    } finally {
      setLoading(false)
    }
  }, [invoiceId, onFetchPdf])

  useEffect(() => {
    if (htmlContent) {
      setPreviewHtml(htmlContent)
      setPreviewUrl(null)
      setError(null)
    }
  }, [htmlContent])

  useEffect(() => {
    if (invoiceId && onFetchPdf) {
      fetchPdf()
    } else if (!htmlContent) {
      setPreviewUrl(null)
      setPreviewHtml(null)
      setError(null)
    }
  }, [invoiceId])

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const displayHtml = previewHtml ?? null
  const displaySrc = previewUrl ?? null
  const iframeSrc = displaySrc && !displayHtml ? displaySrc : undefined
  const iframeSrcDoc = displayHtml ?? undefined

  const handleDownload = useCallback(() => {
    if (previewUrl) {
      const a = document.createElement('a')
      a.href = previewUrl
      a.download = `invoice-${invoiceId ?? 'preview'}.pdf`
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.click()
    } else if (previewHtml) {
      const w = window.open('', '_blank')
      if (w) {
        w.document.write(previewHtml)
        w.document.close()
        w.print()
      }
    }
  }, [previewUrl, previewHtml, invoiceId])

  const hasContent = Boolean(iframeSrc || iframeSrcDoc || loading)

  return (
    <div className={cn('flex flex-col rounded-xl border border-border bg-card overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Invoice preview
        </span>
        <div className="flex gap-2">
          {invoiceId && onFetchPdf && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchPdf}
              disabled={loading}
              className="gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Refresh
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!previewUrl && !previewHtml}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {previewUrl ? 'Download PDF' : previewHtml ? 'Print / Save as PDF' : 'Download'}
          </Button>
        </div>
      </div>
      <div className="relative min-h-[320px] bg-muted/20">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
            {error}
          </div>
        )}
        {loading && !previewUrl && !previewHtml && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
          </div>
        )}
        {(iframeSrc || iframeSrcDoc) && !error && (
          <iframe
            title="Invoice PDF preview"
            src={iframeSrc}
            srcDoc={iframeSrcDoc}
            className="h-full min-h-[320px] w-full border-0"
            sandbox="allow-same-origin"
          />
        )}
        {!hasContent && !loading && !error && (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground text-sm">
            <FileText className="h-12 w-12 opacity-50" />
            <p>Save or send the invoice to generate a preview, or paste HTML above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
