import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Paperclip, Upload, Download, Trash2, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../../config/Api';

const MAX_BYTES = 10 * 1024 * 1024; // Cloudinary's per-file limit on the free plan
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx';
const ALLOWED_EXT = ACCEPT.split(',').map((e) => e.slice(1));
const LABELS = ['Customs declaration', 'Commercial invoice', 'Packing list', 'Bill of lading / AWB', 'Photo', 'Other'];

const formatBytes = (b) => {
  const n = Number(b) || 0;
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(n / 1024))} KB`;
};

// readOnly: clients can view and download their shipment's documents, not upload or delete
export default function DocumentsModal({ shipment: initialShipment, token, isAdmin, currentUserId, readOnly = false, onUpdated, onClose }) {
  const [shipment, setShipment] = useState(initialShipment);
  const [label, setLabel] = useState(LABELS[0]);
  const [uploads, setUploads] = useState([]); // [{ name, progress }]
  const [busyId, setBusyId] = useState(null);
  const documents = [...(shipment.documents || [])].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  const auth = { headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` } };

  const applyUpdate = (updated) => {
    setShipment(updated);
    onUpdated?.(updated);
  };

  const uploadOne = async (file) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) throw new Error(`${file.name}: only PDF, images, Word and Excel files are allowed`);
    if (file.size > MAX_BYTES) throw new Error(`${file.name}: file is larger than 10 MB`);

    const setProgress = (progress) =>
      setUploads((list) => list.map((u) => (u.name === file.name ? { ...u, progress } : u)));

    // 1. Backend signs the upload; 2. browser sends the file straight to Cloudinary;
    // 3. backend records it on the shipment
    const { data: sig } = await axios.post(`${API_BASE_URL}/shipments/${shipment._id}/documents/signature`, {}, auth);
    const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sig.apiKey);
    form.append('timestamp', sig.timestamp);
    form.append('signature', sig.signature);
    form.append('folder', sig.folder);
    form.append('use_filename', String(sig.use_filename));
    form.append('unique_filename', String(sig.unique_filename));
    const { data: uploaded } = await axios.post(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`,
      form,
      { onUploadProgress: (e) => e.total && setProgress(Math.round((e.loaded / e.total) * 100)) }
    );

    const { data: updated } = await axios.post(`${API_BASE_URL}/shipments/${shipment._id}/documents`, {
      name: file.name,
      label,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      resourceType,
      format: uploaded.format || ext,
      bytes: uploaded.bytes,
    }, auth);
    return updated;
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setUploads(files.map((f) => ({ name: f.name, progress: 0 })));
    let ok = 0;
    for (const file of files) {
      try {
        applyUpdate(await uploadOne(file));
        ok += 1;
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.response?.data?.error?.message || err.message || `Failed to upload ${file.name}`);
      }
      setUploads((list) => list.filter((u) => u.name !== file.name));
    }
    if (ok) toast.success(`${ok} document${ok === 1 ? '' : 's'} uploaded`);
  };

  const handleDownload = async (doc) => {
    setBusyId(doc._id);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/shipments/${shipment._id}/documents/${doc._id}/download`, auth);
      window.location.assign(data.url); // signed link served as an attachment, so the page stays put
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not get the download link');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.name}"? This also removes the file from storage.`)) return;
    setBusyId(doc._id);
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/shipments/${shipment._id}/documents/${doc._id}`, auth);
      applyUpdate(data);
      toast.success('Document deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete document');
    } finally {
      setBusyId(null);
    }
  };

  const uploading = uploads.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 pr-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <Paperclip size={20} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          <p className="font-mono text-xs text-gray-500">{shipment.trackingNumber}</p>
        </div>
      </div>

      {/* Upload */}
      {!readOnly && (
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 space-y-1 text-xs font-medium text-gray-600">
            Document type
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={uploading}
              className="h-10 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            >
              {LABELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700 ${uploading ? 'pointer-events-none opacity-60' : ''}`}>
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? 'Uploading…' : 'Choose files'}
            <input type="file" multiple accept={ACCEPT} onChange={handleFiles} className="hidden" />
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">PDF, images, Word or Excel · up to 10 MB each</p>
        {uploads.map((u) => (
          <div key={u.name} className="mt-3">
            <div className="flex justify-between text-xs text-gray-600">
              <span className="truncate pr-2">{u.name}</span>
              <span className="tabular-nums">{u.progress}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-green-600 transition-all" style={{ width: `${u.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
      )}

      {/* List */}
      {documents.length === 0 ? (
        <p className="rounded-xl border border-gray-200 px-4 py-6 text-center text-sm text-gray-500">No documents yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
          {documents.map((doc) => {
            const canDelete = !readOnly && (isAdmin || (currentUserId && String(doc.uploadedBy) === String(currentUserId)));
            const Icon = doc.resourceType === 'image' ? ImageIcon : FileText;
            return (
              <li key={doc._id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900" title={doc.name}>{doc.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    {doc.label ? `${doc.label} · ` : ''}{formatBytes(doc.bytes)} ·{' '}
                    {new Date(doc.uploadedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  disabled={busyId === doc._id}
                  title="Download"
                  aria-label={`Download ${doc.name}`}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
                >
                  {busyId === doc._id ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                </button>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(doc)}
                    disabled={busyId === doc._id}
                    title="Delete"
                    aria-label={`Delete ${doc.name}`}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="h-10 cursor-pointer rounded-xl px-4 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Close
        </button>
      </div>
    </div>
  );
}
