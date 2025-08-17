import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import cargorealmlogo from '../../images/cargorealmlogo.png'

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

  // Helper function to get color styles based on status
  const getStatusColors = (status) => {
    switch (status) {
      case 'delivered': 
        return { backgroundColor: '#D1FAE5', color: '#065F46' }; // Green
      case 'in-transit': 
        return { backgroundColor: '#FEF9C3', color: '#854D0E' }; // Amber
      case 'cancelled': 
        return { backgroundColor: '#FECACA', color: '#991B1B' }; // Red
      case 'processing': 
        return { backgroundColor: '#DBEAFE', color: '#1E3A8A' }; // Blue
      case 'pickup-scheduled': 
        return { backgroundColor: '#FFF7ED', color: '#9A3412' }; // Orange
      case 'out-for-delivery': 
        return { backgroundColor: '#FCE7F3', color: '#9D174D' }; // Pink
      case 'picked-up': 
        return { backgroundColor: '#F3E8FF', color: '#6B21A8' }; // Purple
      case 'arrived-at-hub': 
        return { backgroundColor: '#EDE9FE', color: '#5B21B6' }; // Indigo
      case 'departed-from-hub': 
        return { backgroundColor: '#E0F2FE', color: '#0369A1' }; // Sky Blue
      case 'on-hold': 
        return { backgroundColor: '#FEF2F2', color: '#B91C1C' }; // Strong Red
      case 'customs-clearance': 
        return { backgroundColor: '#CCFBF1', color: '#0F766E' }; // Teal
      case 'Awaiting Pickup': 
        return { backgroundColor: '#FAE8FF', color: '#86198F' }; // Fuchsia
      case 'failed-delivery-attempt': 
        return { backgroundColor: '#FFE4E6', color: '#9F1239' }; // Rose
      case 'Awaiting Delivery': 
        return { backgroundColor: '#ECFCCB', color: '#3F6212' }; // Lime
      case 'Arrived Carrier Connecting facility': 
        return { backgroundColor: '#FEF9C3', color: '#713F12' }; // Yellow
      case 'Departed CARGO realm facility (Nig)': 
        return { backgroundColor: '#FFEDD5', color: '#9A3412' }; // Orange
      case 'Arrived nearest airport': 
        return { backgroundColor: '#E0F2FE', color: '#075985' }; // Sky
      case 'Shipment is Delayed': 
        return { backgroundColor: '#FFE4E6', color: '#9F1239' }; // Rose
      case 'Delivery date not available': 
        return { backgroundColor: '#F3F4F6', color: '#1F2937' }; // Neutral Gray
      case 'Available for pick up,check phone for instructions': 
        return { backgroundColor: '#DCFCE7', color: '#166534' }; // Strong Green
      case 'Processed in Lagos Nigeria': 
        return { backgroundColor: '#FDE68A', color: '#92400E' }; // Amber
      case 'Pending Carrier lift': 
        return { backgroundColor: '#E0E7FF', color: '#3730A3' }; // Indigo Blue
      case 'Scheduled to depart on the next movement': 
        return { backgroundColor: '#FBCFE8', color: '#9D174D' }; // Pink
      case 'Received from flight': 
        return { backgroundColor: '#E0F7FA', color: '#006064' }; // Cyan
      case 'Package is received and accepted by airline': 
        return { backgroundColor: '#D1FAE5', color: '#065F46' }; // Deep Green
      case 'Customs clearance completed': 
        return { backgroundColor: '#BBF7D0', color: '#15803D' }; // Bright Green
      case 'Delivery is booked': 
        return { backgroundColor: '#E0E7FF', color: '#4338CA' }; // Blue Indigo
      case 'Arrived at an international sorting facility and will be ready for delivery soon': 
        return { backgroundColor: '#C7D2FE', color: '#1E3A8A' }; // Cool Indigo
      case 'pending': 
        return { backgroundColor: '#FEF2F2', color: '#B91C1C' }; // Red Neutral
      default: 
        return { backgroundColor: '#F3F4F6', color: '#1F2937' }; // Neutral Gray
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
                  src={cargorealmlogo}
                  alt="Logo"
                  style={{ width: '250px', height: '70px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>Cargo Realm and Logistics</p>
                  <p>Nacho Export Warehouse, Murital Muhammad International Airport, Ikeja Lagos.</p>
                  <p>Email: info@cargorealmandlosgistics.com</p>
                </div>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Shipment Details - <span style={{ color: '#22C55E' }}>{shipment.trackingNumber}</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: '3rem', rowGap: '1rem', color: '#4B5563' }}>
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
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Shipment Pieces</span>
                  <span style={{ fontWeight: '500' }}>{shipment.shipmentPieces}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Shipment Type</span>
                  <span style={{ fontWeight: '500' }}>{shipment.shipmentType}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Shipment Purpose</span>
                  <span style={{ fontWeight: '500' }}>{shipment.shipmentPurpose}</span>
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
                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Shipment Items</span>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#43A047', color: '#FFFFFF', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem', borderBottom: '1px solid #E5E7EB' }}>S/N</th>
                        <th style={{ padding: '0.5rem', borderBottom: '1px solid #E5E7EB' }}>Item Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipment.items.map((item, index) => (
                        <tr key={index}>
                          <td style={{ padding: '0.5rem', borderBottom: '1px solid #E5E7EB' }}>{index + 1}</td>
                          <td style={{ padding: '0.5rem', borderBottom: '1px solid #E5E7EB' }}>{item}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
