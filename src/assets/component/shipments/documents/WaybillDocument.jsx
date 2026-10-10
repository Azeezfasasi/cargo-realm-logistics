import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import logo from '../../../images/cargorealmlogo.png';
import {
  COMPANY, BRAND, BRAND_LIGHT, INK, MUTED, LINE,
  base, show, formatDate, formatStatus, dimensions, items,
} from './pdfShared';

const s = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 3, borderBottomColor: BRAND, paddingBottom: 12, marginBottom: 14 },
  title: { fontSize: 22, lineHeight: 1, fontFamily: 'Helvetica-Bold', color: BRAND, letterSpacing: 1.5, marginBottom: 4 },
  trackingBox: { borderWidth: 2, borderColor: INK, borderRadius: 4, paddingVertical: 6, paddingHorizontal: 10, marginTop: 6, alignItems: 'center' },
  trackingNo: { fontSize: 16, fontFamily: 'Helvetica-Bold', letterSpacing: 1.2 },
  qr: { width: 84, height: 84 },
  parties: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  party: { flex: 1, minHeight: 92 },
  partyName: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderColor: LINE, borderRadius: 4, marginBottom: 12 },
  cell: { width: '25%', padding: 8, borderRightWidth: 1, borderBottomWidth: 1, borderColor: LINE },
  cellWide: { width: '50%' },
  cellValue: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  contents: { backgroundColor: BRAND_LIGHT, borderRadius: 4, padding: 10, marginBottom: 12 },
  itemRow: { flexDirection: 'row', paddingVertical: 2 },
  itemNo: { width: 18, color: MUTED },
  sigRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  sigBox: { flex: 1, borderWidth: 1, borderColor: LINE, borderRadius: 4, padding: 10, minHeight: 110 },
  sigLine: { borderBottomWidth: 1, borderBottomColor: '#9ca3af', marginTop: 26, marginBottom: 3 },
  sigValue: { marginTop: 12, fontSize: 9.5 },
  terms: { marginTop: 12, fontSize: 7.5, color: MUTED },
});

function Cell({ label, value, wide }) {
  return (
    <View style={[s.cell, wide ? s.cellWide : null]}>
      <Text style={base.label}>{label}</Text>
      <Text style={s.cellValue}>{value}</Text>
    </View>
  );
}

function Party({ title, name, address, phone, email }) {
  return (
    <View style={[base.card, s.party]}>
      <Text style={base.cardTitle}>{title}</Text>
      <Text style={s.partyName}>{show(name)}</Text>
      {address ? <Text>{address}</Text> : null}
      {phone ? <Text style={{ marginTop: 2 }}>Tel: {phone}</Text> : null}
      {email ? <Text style={base.muted}>{email}</Text> : null}
    </View>
  );
}

// `values` pre-fills lines (e.g. from the recorded proof of delivery)
function Signature({ title, lines, values = [] }) {
  return (
    <View style={s.sigBox}>
      <Text style={base.cardTitle}>{title}</Text>
      {lines.map((l, i) => (
        <View key={l}>
          {values[i] ? (
            <Text style={[s.sigValue, base.bold]}>{values[i]}</Text>
          ) : null}
          <View style={[s.sigLine, values[i] ? { marginTop: 2 } : null]} />
          <Text style={[base.muted, { fontSize: 7.5 }]}>{l}</Text>
        </View>
      ))}
    </View>
  );
}

export default function WaybillDocument({ shipment }) {
  const contents = items(shipment);

  return (
    <Document title={`Waybill ${shipment.trackingNumber}`} author={COMPANY.name}>
      <Page size="A4" style={base.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Image src={logo} style={base.logo} />
            <Text style={[base.muted, { marginTop: 6, maxWidth: 210 }]}>{COMPANY.address}</Text>
            <Text style={base.muted}>{COMPANY.email}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={s.title}>WAYBILL</Text>
            <View style={s.trackingBox}>
              <Text style={base.label}>Tracking number</Text>
              <Text style={s.trackingNo}>{show(shipment.trackingNumber)}</Text>
            </View>
          </View>
          {shipment.qrCodeUrl ? (
            <View style={{ alignItems: 'center' }}>
              <Image src={shipment.qrCodeUrl} style={s.qr} />
              <Text style={[base.muted, { fontSize: 7 }]}>Scan to track</Text>
            </View>
          ) : <View style={{ width: 84 }} />}
        </View>

        {/* Shipper / Consignee */}
        <View style={s.parties}>
          <Party title="Shipper (from)" name={shipment.senderName} address={shipment.senderAddress} phone={shipment.senderPhone} email={shipment.senderEmail} />
          <Party title="Consignee (to)" name={shipment.recipientName} address={shipment.recipientAddress} phone={shipment.recipientPhone} email={shipment.receiverEmail} />
        </View>

        {/* Shipment details */}
        <View style={s.grid}>
          <Cell label="Origin" value={show(shipment.origin)} wide />
          <Cell label="Destination" value={show(shipment.destination)} wide />
          <Cell label="Ship date" value={formatDate(shipment.shipmentDate || shipment.createdAt)} />
          <Cell label="Est. delivery" value={formatDate(shipment.deliveryDate)} />
          <Cell label="Facility" value={show(shipment.shipmentFacility)} />
          <Cell label="Status" value={formatStatus(shipment.status)} />
          <Cell label="Service type" value={show(shipment.shipmentType)} />
          <Cell label="Purpose" value={show(shipment.shipmentPurpose)} />
          <Cell label="Pieces" value={show(shipment.shipmentPieces)} />
          <Cell label="Weight" value={shipment.weight ? `${shipment.weight} kg` : '—'} />
          <Cell label="Dimensions (L x W x H)" value={dimensions(shipment)} wide />
          <Cell label="Volume" value={shipment.volume ? String(shipment.volume) : '—'} wide />
        </View>

        {/* Contents */}
        <View style={s.contents} wrap={false}>
          <Text style={base.cardTitle}>Description of contents</Text>
          {contents.length > 0 ? (
            contents.map((item, i) => (
              <View key={i} style={s.itemRow}>
                <Text style={s.itemNo}>{i + 1}.</Text>
                <Text style={{ flex: 1 }}>{item}</Text>
              </View>
            ))
          ) : (
            <Text style={base.muted}>No items listed</Text>
          )}
          {shipment.notes ? <Text style={[base.muted, { marginTop: 6 }]}>Notes: {shipment.notes}</Text> : null}
        </View>

        {/* Signatures */}
        <View style={s.sigRow} wrap={false}>
          <Signature title="Shipper" lines={['Signature', 'Date']} />
          <Signature title="Received by carrier" lines={['Agent name & signature', 'Date']} />
          <Signature
            title="Delivered to consignee"
            lines={['Name & signature', 'Date & time']}
            values={[
              shipment.proofOfDelivery?.receivedBy,
              shipment.deliveredAt
                ? new Date(shipment.deliveredAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : null,
            ]}
          />
        </View>

        <Text style={s.terms}>
          The shipper certifies that the particulars on this waybill are correct and that the shipment contains no
          prohibited or undeclared dangerous goods. Track this shipment at {COMPANY.trackingUrl}.
        </Text>

        <View style={base.footer} fixed>
          <Text>{COMPANY.name} · {COMPANY.website}</Text>
          <Text>{COMPANY.email}</Text>
        </View>
      </Page>
    </Document>
  );
}
