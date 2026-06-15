import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Printer, Trash2 } from 'lucide-react'
import { buildCustomerUrl } from '../utils/url'

interface TableQrCardProps {
  tableNumber: number
  onRemove: () => void
}

export function TableQrCard({ tableNumber, onRemove }: TableQrCardProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const url = buildCustomerUrl(tableNumber)

  const downloadQr = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `table-${tableNumber}-qr.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const printQr = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>Table ${tableNumber} QR</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif">
        <h1>Table ${tableNumber}</h1>
        <img src="${canvas.toDataURL('image/png')}" width="300" height="300" />
        <p style="margin-top:1rem;font-size:14px;color:#666">${url}</p>
        <script>window.onload=()=>{window.print();}</script>
      </body></html>
    `)
    win.document.close()
  }

  return (
    <div className="rounded-xl bg-white shadow-md p-4 flex flex-col items-center gap-3">
      <p className="font-display text-lg font-bold text-espresso">Table {tableNumber}</p>
      <div ref={canvasRef} className="p-2 bg-white rounded-lg">
        <QRCodeCanvas value={url} size={200} level="M" includeMargin />
      </div>
      <p className="text-[10px] text-espresso/40 text-center break-all max-w-[200px]">{url}</p>
      <div className="flex gap-2 w-full">
        <button
          onClick={downloadQr}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber text-white text-sm font-semibold py-2 hover:bg-amber/90"
        >
          <Download size={14} /> Download
        </button>
        <button
          onClick={printQr}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-espresso text-cream text-sm font-semibold py-2 hover:bg-espresso/90"
        >
          <Printer size={14} /> Print
        </button>
        <button
          onClick={onRemove}
          className="rounded-lg border border-red-200 text-red-600 p-2 hover:bg-red-50"
          aria-label="Remove table"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
