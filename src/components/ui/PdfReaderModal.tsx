"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react"

// ✅ Use CDN worker (avoids canvas / SSR issues)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

type PdfReaderModalProps = {
  file: string
  title: string
  onClose: () => void
}

export function PdfReaderModal({ file, title, onClose }: PdfReaderModalProps) {
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)

  // 🔑 container-based sizing
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pageWidth, setPageWidth] = useState<number>(800)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setPageWidth(Math.min(width, 900)) // cap max width
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-background w-full max-w-6xl h-[95vh] rounded-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-bold text-base sm:text-lg truncate">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition"
          >
            <X />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-3 py-2 border-b gap-2 text-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
              disabled={pageNumber <= 1}
              className="p-2 rounded hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft />
            </button>

            <span>
              Page {pageNumber} / {numPages}
            </span>

            <button
              onClick={() =>
                setPageNumber(p => Math.min(p + 1, numPages || 1))
              }
              disabled={pageNumber >= (numPages || 1)}
              className="p-2 rounded hover:bg-muted disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(s => Math.max(s - 0.1, 0.6))}
              className="p-2 rounded hover:bg-muted"
            >
              <ZoomOut />
            </button>
            <button
              onClick={() => setScale(s => Math.min(s + 0.1, 2))}
              className="p-2 rounded hover:bg-muted"
            >
              <ZoomIn />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-muted relative">

          {/* Watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 text-4xl sm:text-6xl font-bold rotate-[-30deg] z-10">
            SFU - Party
          </div>

          <div
            ref={containerRef}
            className="mx-auto w-full max-w-5xl px-2 sm:px-4 py-6 flex justify-center"
          >
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={<p className="p-6 text-center">Loading document…</p>}
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  )
}
