// Lazy-loaded (see AllShipmentsMain / DeliveredShipmentMain) so @react-pdf stays out of the main bundle
import React, { useMemo } from 'react';
import { usePDF } from '@react-pdf/renderer';
import { Download, ExternalLink, FileText, Loader2, AlertTriangle } from 'lucide-react';
import InvoiceDocument from './InvoiceDocument';
import WaybillDocument from './WaybillDocument';

const TYPES = {
  invoice: { title: 'Invoice', Doc: InvoiceDocument, file: 'Invoice' },
  waybill: { title: 'Waybill', Doc: WaybillDocument, file: 'Waybill' },
};

export default function ShipmentDocumentModal({ shipment, type, onClose }) {
  const config = TYPES[type] || TYPES.invoice;
  const document = useMemo(() => {
    const DocComponent = (TYPES[type] || TYPES.invoice).Doc;
    return <DocComponent shipment={shipment} />;
  }, [type, shipment]);
  const [pdf] = usePDF({ document });
  const fileName = `${config.file}_${shipment.trackingNumber || shipment._id}.pdf`;
  const ready = !pdf.loading && pdf.url && !pdf.error;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 pr-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <FileText size={20} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          <p className="font-mono text-xs text-gray-500">{shipment.trackingNumber}</p>
        </div>
      </div>

      <div className="relative h-[60vh] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        {pdf.error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-rose-600">
            <AlertTriangle size={22} />
            Couldn&apos;t generate the {config.title.toLowerCase()}: {String(pdf.error)}
          </div>
        ) : ready ? (
          <>
            <iframe title={`${config.title} preview`} src={pdf.url} className="hidden h-full w-full md:block" />
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-gray-600 md:hidden">
              <FileText size={28} className="text-gray-400" />
              Preview isn&apos;t available on small screens. Use Download or Open below.
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 size={18} className="animate-spin" /> Generating {config.title.toLowerCase()}…
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="h-10 cursor-pointer rounded-xl px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          Close
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => window.open(pdf.url, '_blank', 'noopener')}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ExternalLink size={15} /> Open / Print
        </button>
        <a
          href={ready ? pdf.url : undefined}
          download={fileName}
          aria-disabled={!ready}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 ${
            ready ? '' : 'pointer-events-none opacity-50'
          }`}
        >
          <Download size={15} /> Download PDF
        </a>
      </div>
    </div>
  );
}
