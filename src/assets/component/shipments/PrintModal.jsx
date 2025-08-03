import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import logo2 from '../../images/logo2.png'

export default function PrintModalContent({ shipment, onClose }) {
  const printRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(true);

  // Dynamically load the external scripts
  useEffect(() => {
    // Function to load a single script
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.head.appendChild(script);
      });
    };

    // Load both scripts in parallel
    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
    ])
    .then(() => {
      console.log("PDF libraries loaded successfully.");
      setIsScriptLoading(false);
    })
    .catch((error) => {
      console.error("Failed to load PDF libraries:", error);
    });
  }, []);

  const handleDownloadPDF = async () => {
    if (!printRef.current || isDownloading || isScriptLoading) {
      console.error("Cannot generate PDF: component ref is missing, download is in progress, or scripts are still loading.");
      return;
    }

    setIsDownloading(true);

    try {
      // Capture the entire content as a single canvas
      const canvas = await window.html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Check if content fits on a single page
      if (pdfHeight < pdf.internal.pageSize.getHeight()) {
        // If content fits, add as a single image
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        // If content is longer than one page, split into multiple pages
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(`Shipment_${shipment?.trackingNumber || 'details'}.pdf`);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to get color styles based on status, using standard hex codes
  const getStatusColors = (status) => {
    switch (status) {
      case 'delivered': return { backgroundColor: '#D1FAE5', color: '#166534' };
      case 'in-transit': return { backgroundColor: '#FEFCE8', color: '#92400E' };
      case 'cancelled': return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      case 'processing': return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      case 'pickup-scheduled': return { backgroundColor: '#FFFBEB', color: '#975A16' };
      case 'out-for-delivery': return { backgroundColor: '#FCE7F3', color: '#9D174D' };
      case 'picked-up': return { backgroundColor: '#F3E8FF', color: '#6B21A8' };
      case 'arrived-at-hub': return { backgroundColor: '#F5F3FF', color: '#4C1D95' };
      case 'departed-from-hub': return { backgroundColor: '#E0E7FF', color: '#3730A3' };
      case 'on-hold': return { backgroundColor: '#FCE7F3', color: '#9D174D' };
      case 'customs-clearance': return { backgroundColor: '#CFFAFE', color: '#083344' };
      case 'Awaiting Pickup': return { backgroundColor: '#FDF2F8', color: '#86198F' };
      case 'failed-delivery-attempt': return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      case 'Awaiting Delivery': return { backgroundColor: '#F7FEE7', color: '#3F6212' };
      case 'pending': return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      default: return { backgroundColor: '#F3F4F6', color: '#1F2937' };
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold">Shipment Details</h2>
      <div className="overflow-auto max-h-[70vh] my-4">
        {/* The content below uses inline styles for full compatibility with html2canvas */}
        <div ref={printRef} style={{ backgroundColor: '#ffffff', color: '#000000', padding: '1rem', height: '100%', fontSize: '0.875rem' }}>
          {shipment ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <img
                  src={logo2}
                  alt="Logo"
                  style={{ width: '250px', height: '70px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>Cargo Realm and Logistics</p>
                  <p>Plot 8A, Ajao Road, Lagos, Nigeria</p>
                  <p>Email: info@cargorealmandlosgistics.com</p>
                </div>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Shipment Details - <span style={{ color: '#22C55E' }}>{shipment.trackingNumber}</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: '2rem', rowGap: '1rem', color: '#4B5563' }}>
                {/* Shipment details */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Tracking Number</span>
                  <span style={{ fontWeight: '500', color: '#111827' }}>{shipment.trackingNumber}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Sender Name</span>
                  <span style={{ fontWeight: '500', color: '#111827' }}>{shipment.senderName}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Sender Phone</span>
                  <span style={{ fontWeight: '500', color: '#111827' }}>{shipment.senderPhone}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Sender Email</span>
                  <span style={{ fontWeight: '500', color: '#111827' }}>{shipment.senderEmail}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Sender Address</span>
                  <span style={{ fontWeight: '500', color: '#111827' }}>{shipment.senderAddress}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Status</span>
                  <span style={{ ...getStatusColors(shipment.status), fontWeight: '500', textTransform: 'capitalize', width: 'fit-content', padding: '0rem 0.5rem', borderRadius: '0.375rem' }}>
                    {shipment.status}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Receiver Name</span>
                  <span style={{ fontWeight: '500' }}>{shipment.recipientName}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Receiver Phone</span>
                  <span style={{ fontWeight: '500' }}>{shipment.recipientPhone}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Receiver Email</span>
                  <span style={{ fontWeight: '500' }}>{shipment.receiverEmail}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Receiver Address</span>
                  <span style={{ fontWeight: '500' }}>{shipment.recipientAddress}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Origin Address</span>
                  <span style={{ fontWeight: '500' }}>{shipment.origin}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Destination Address</span>
                  <span style={{ fontWeight: '500' }}>{shipment.destination}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Weight</span>
                  <span style={{ fontWeight: '500' }}>{shipment.weight}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Length</span>
                  <span style={{ fontWeight: '500' }}>{shipment.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Width</span>
                  <span style={{ fontWeight: '500' }}>{shipment.width}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Height</span>
                  <span style={{ fontWeight: '500' }}>{shipment.height}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Shipment Cost</span>
                  <span style={{ fontWeight: '500' }}>₦{shipment.cost}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Shipment Date</span>
                  <span style={{ fontWeight: '500' }}>{new Date(shipment.shipmentDate).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Description</span>
                  <span style={{ fontWeight: '500' }}>{shipment.notes}</span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <p>Loading shipment data...</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleDownloadPDF} disabled={!shipment || isDownloading || isScriptLoading}>
          {isScriptLoading ? (
            'Loading Libraries...'
          ) : isDownloading ? (
            'Downloading...'
          ) : (
            <>
               Download PDF
            </>
          )}
        </Button>
      </div>
    </>
  );
}
