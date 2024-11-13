'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Set up the worker for react-pdf with an HTTPS URL to avoid mixed content issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function Uploader() {
  const [pdfFile, setPdfFile] = useState(null)
  const [numPages, setNumPages] = useState(null)

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPdfFile(new Uint8Array(e.target.result))
      }
      reader.readAsArrayBuffer(file)
    } else {
      alert('Please upload a valid PDF file.')
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Resume Uploader</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {pdfFile && (
            <div className="border rounded-lg overflow-hidden">
              <Document
                file={{ data: pdfFile }}
                onLoadSuccess={onDocumentLoadSuccess}
                className="max-h-[70vh] overflow-y-auto"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="mb-4"
                  />
                ))}
              </Document>
            </div>
          )}
          {pdfFile && (
            <div className="text-sm text-muted-foreground">
              Total Pages: {numPages}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
