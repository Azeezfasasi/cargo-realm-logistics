import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import logo from '../../../images/cargorealmlogo.png';
import {
  COMPANY, BRAND, BRAND_LIGHT, MUTED, LINE,
  base, show, formatDate, formatMoney, formatStatus, items,
} from './pdfShared';

const PAYMENT_METHOD_LABELS = { cash: 'Cash', 'bank-transfer': 'Bank transfer', card: 'Card', pos: 'POS', other: 'Other' };

const s = StyleSheet.create({
  title: { fontSize: 26, lineHeight: 1, fontFamily: 'Helvetica-Bold', color: BRAND, letterSpacing: 1, textAlign: 'right', marginBottom: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 3 },
  metaLabel: { width: 70, textAlign: 'right', color: MUTED, marginRight: 8 },
  metaValue: { width: 110, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  rule: { height: 3, backgroundColor: BRAND, marginTop: 14, marginBottom: 16, borderRadius: 2 },
  parties: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  party: { flex: 1 },
  partyName: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  summary: { flexDirection: 'row', backgroundColor: BRAND_LIGHT, borderRadius: 4, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 16 },
  summaryCell: { flex: 1 },
  tableHead: { flexDirection: 'row', backgroundColor: BRAND, color: '#ffffff', paddingVertical: 6, paddingHorizontal: 8, borderTopLeftRadius: 4, borderTopRightRadius: 4, fontFamily: 'Helvetica-Bold', fontSize: 8.5 },
  tableRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: LINE },
  colDesc: { flex: 1, paddingRight: 8 },
  colQty: { width: 50, textAlign: 'center' },
  colAmt: { width: 110, textAlign: 'right' },
  totals: { alignSelf: 'flex-end', width: 230, marginTop: 10 },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  grandTotal: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: BRAND, color: '#ffffff', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 4, marginTop: 4 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 28 },
  qr: { width: 70, height: 70 },
});

export default function InvoiceDocument({ shipment }) {
  const cost = Number(shipment.cost);
  const hasCost = Number.isFinite(cost) && cost > 0;
  const contents = items(shipment);
  const issued = shipment.shipmentDate || shipment.createdAt;
  const paid = Number(shipment.amountPaid) || 0;
  const balance = hasCost ? Math.max(0, cost - paid) : 0;
  const isPaid = shipment.paymentStatus === 'paid';

  return (
    <Document title={`Invoice ${shipment.trackingNumber}`} author={COMPANY.name}>
      <Page size="A4" style={base.page}>
        {/* Header */}
        <View style={base.between}>
          <View>
            <Image src={logo} style={base.logo} />
            <Text style={[base.bold, { marginTop: 8 }]}>{COMPANY.name}</Text>
            <Text style={[base.muted, { maxWidth: 230 }]}>{COMPANY.address}</Text>
            <Text style={base.muted}>{COMPANY.email}</Text>
          </View>
          <View>
            <Text style={s.title}>INVOICE</Text>
            <View style={s.metaRow}><Text style={s.metaLabel}>Invoice No.</Text><Text style={s.metaValue}>INV-{shipment.trackingNumber}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Issue date</Text><Text style={s.metaValue}>{formatDate(issued)}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Tracking No.</Text><Text style={s.metaValue}>{show(shipment.trackingNumber)}</Text></View>
          </View>
        </View>

        <View style={s.rule} />

        {/* Bill to / Ship to */}
        <View style={s.parties}>
          <View style={[base.card, s.party]}>
            <Text style={base.cardTitle}>Bill to</Text>
            <Text style={s.partyName}>{show(shipment.senderName)}</Text>
            {shipment.senderAddress ? <Text>{shipment.senderAddress}</Text> : null}
            {shipment.senderPhone ? <Text style={base.muted}>{shipment.senderPhone}</Text> : null}
            {shipment.senderEmail ? <Text style={base.muted}>{shipment.senderEmail}</Text> : null}
          </View>
          <View style={[base.card, s.party]}>
            <Text style={base.cardTitle}>Ship to</Text>
            <Text style={s.partyName}>{show(shipment.recipientName)}</Text>
            {shipment.recipientAddress ? <Text>{shipment.recipientAddress}</Text> : null}
            {shipment.recipientPhone ? <Text style={base.muted}>{shipment.recipientPhone}</Text> : null}
            {shipment.receiverEmail ? <Text style={base.muted}>{shipment.receiverEmail}</Text> : null}
          </View>
        </View>

        {/* Shipment summary */}
        <View style={s.summary}>
          <View style={s.summaryCell}><Text style={base.label}>Origin</Text><Text>{show(shipment.origin)}</Text></View>
          <View style={s.summaryCell}><Text style={base.label}>Destination</Text><Text>{show(shipment.destination)}</Text></View>
          <View style={s.summaryCell}><Text style={base.label}>Service</Text><Text>{show(shipment.shipmentType)}</Text></View>
          <View style={s.summaryCell}><Text style={base.label}>Weight</Text><Text>{shipment.weight ? `${shipment.weight} kg` : '—'}</Text></View>
        </View>

        {/* Line items */}
        <View style={s.tableHead}>
          <Text style={s.colDesc}>Description</Text>
          <Text style={s.colQty}>Pieces</Text>
          <Text style={s.colAmt}>Amount</Text>
        </View>
        <View style={s.tableRow} wrap={false}>
          <View style={s.colDesc}>
            <Text style={base.bold}>
              Freight charges{shipment.shipmentType ? ` — ${shipment.shipmentType}` : ''}
            </Text>
            <Text style={base.muted}>
              {show(shipment.origin)} to {show(shipment.destination)}
              {shipment.shipmentPurpose ? ` · ${shipment.shipmentPurpose}` : ''}
            </Text>
            {contents.length > 0 && (
              <Text style={[base.muted, { marginTop: 3 }]}>Contents: {contents.join(', ')}</Text>
            )}
          </View>
          <Text style={s.colQty}>{show(shipment.shipmentPieces)}</Text>
          <Text style={s.colAmt}>{hasCost ? formatMoney(cost) : '—'}</Text>
        </View>

        {/* Totals */}
        <View style={s.totals}>
          <View style={s.totalLine}><Text style={base.muted}>Subtotal</Text><Text>{hasCost ? formatMoney(cost) : '—'}</Text></View>
          <View style={s.totalLine}>
            <Text style={base.bold}>Total</Text>
            <Text style={base.bold}>{hasCost ? formatMoney(cost) : 'To be confirmed'}</Text>
          </View>
          {paid > 0 && (
            <View style={s.totalLine}><Text style={base.muted}>Amount paid</Text><Text>- {formatMoney(paid)}</Text></View>
          )}
          <View style={[s.grandTotal, isPaid ? { backgroundColor: '#047857' } : null]}>
            <Text style={base.bold}>{isPaid ? 'PAID IN FULL' : 'Balance due'}</Text>
            <Text style={base.bold}>{hasCost ? formatMoney(balance) : 'To be confirmed'}</Text>
          </View>
        </View>

        {/* Payments received */}
        {Array.isArray(shipment.payments) && shipment.payments.length > 0 && (
          <View style={{ marginTop: 18 }} wrap={false}>
            <Text style={base.label}>Payments received</Text>
            {shipment.payments.map((p, i) => (
              <View key={p._id || i} style={[base.between, { paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: LINE }]}>
                <Text>
                  {formatDate(p.paidAt)} · {PAYMENT_METHOD_LABELS[p.method] || 'Other'}{p.reference ? ` · Ref ${p.reference}` : ''}
                </Text>
                <Text>{formatMoney(p.amount)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Notes + QR */}
        <View style={s.bottom} wrap={false}>
          <View style={{ maxWidth: 330 }}>
            <Text style={base.label}>Shipment status</Text>
            <Text style={{ marginBottom: 8 }}>{formatStatus(shipment.status)}</Text>
            {shipment.notes ? (
              <>
                <Text style={base.label}>Notes</Text>
                <Text style={[base.muted, { marginBottom: 8 }]}>{shipment.notes}</Text>
              </>
            ) : null}
            <Text style={[base.bold, { color: BRAND }]}>Thank you for shipping with us.</Text>
          </View>
          {shipment.qrCodeUrl ? (
            <View style={{ alignItems: 'center' }}>
              <Image src={shipment.qrCodeUrl} style={s.qr} />
              <Text style={[base.muted, { fontSize: 7 }]}>Scan to track</Text>
            </View>
          ) : null}
        </View>

        <View style={base.footer} fixed>
          <Text>{COMPANY.name} · {COMPANY.website}</Text>
          <Text>{COMPANY.email}</Text>
        </View>
      </Page>
    </Document>
  );
}
