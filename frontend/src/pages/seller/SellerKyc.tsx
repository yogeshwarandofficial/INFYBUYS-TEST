import React, { useState, useCallback } from "react";
import { useSellerKyc } from "@/hooks/useSellerKyc";
import {
  Building2, UploadCloud, CheckCircle2, Trash2,
  ShieldCheck, MapPin, Phone, Search, Clock, XCircle,
  FileText, Sparkles, ArrowRight, RefreshCw, AlertCircle
} from "lucide-react";

const DOC_TYPES = [
  { type: "IDENTITY",       label: "Identity Proof",  desc: "Passport, Driver licence or National ID",               accent: "blue"   },
  { type: "BUSINESS_PROOF", label: "Business Proof",  desc: "Certificate of Incorporation or Company Registration",   accent: "purple" },
  { type: "ADDRESS_PROOF",  label: "Address Proof",   desc: "Utility bill or bank statement (< 3 months old)",       accent: "cyan"   },
] as const;

const ACCENTS: Record<string, { bg: string; border: string; text: string; dot: string; glow: string }> = {
  blue:   { bg: "bg-blue-50/50",   border: "border-blue-200/50",   text: "text-blue-600",   dot: "bg-blue-500",   glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
  purple: { bg: "bg-purple-50/50", border: "border-purple-200/50", text: "text-purple-600", dot: "bg-purple-500", glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]" },
  cyan:   { bg: "bg-cyan-50/50",   border: "border-cyan-200/50",   text: "text-cyan-600",   dot: "bg-cyan-500",   glow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]" },
};

const inputCls = (disabled?: boolean) =>
  `w-full px-4 py-3.5 rounded-2xl border text-[15px] font-medium transition-all duration-300 outline-none ` +
  (disabled
    ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
    : "bg-slate-50/50 border-slate-200/60 text-slate-900 hover:bg-white hover:border-blue-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 shadow-sm");

// ── Toast ────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  React.useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-semibold max-w-sm animate-pop-in
      ${type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700" : "bg-red-500/10 border-red-500/20 text-red-700"}`}>
      {type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
      <span className="flex-1">{msg}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 text-lg leading-none ml-2 transition-opacity">&times;</button>
    </div>
  );
}

// ── Status Banner ─────────────────────────────────────────────────────────
function StatusBanner({ status, rejectionReason }: { status: string; rejectionReason?: string }) {
  if (status === "PENDING") return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 flex items-start gap-5 shadow-sm animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm"><Clock className="w-6 h-6 text-amber-600" /></div>
      <div className="relative z-10">
        <h3 className="font-bold text-amber-900 text-[17px]">Verification Under Review</h3>
        <p className="text-amber-800/80 text-sm mt-1.5 leading-relaxed max-w-2xl">Our compliance team is carefully reviewing your submission. You will be notified within 1-2 business days. No changes can be made at this time.</p>
      </div>
      <div className="absolute -right-4 -top-4 opacity-[0.03] transform rotate-12 scale-150"><Clock className="w-32 h-32 text-amber-900" /></div>
    </div>
  );
  if (status === "APPROVED") return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 flex items-start gap-5 shadow-sm animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm"><ShieldCheck className="w-6 h-6 text-emerald-600" /></div>
      <div className="relative z-10">
        <h3 className="font-bold text-emerald-900 text-[17px]">Business Verified</h3>
        <p className="text-emerald-800/80 text-sm mt-1.5 leading-relaxed max-w-2xl">Your business has been successfully verified! You can now create and publish premium listings on INFYBUYS.</p>
      </div>
      <div className="absolute -right-4 -top-4 opacity-[0.03] transform rotate-12 scale-150"><ShieldCheck className="w-32 h-32 text-emerald-900" /></div>
    </div>
  );
  if (status === "REJECTED") return (
    <div className="relative overflow-hidden rounded-3xl border border-red-200/60 bg-gradient-to-br from-red-50 to-rose-50/50 p-6 flex items-start gap-5 shadow-sm animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm"><XCircle className="w-6 h-6 text-red-600" /></div>
      <div className="relative z-10">
        <h3 className="font-bold text-red-900 text-[17px]">Verification Rejected</h3>
        {rejectionReason && <p className="text-red-800/90 text-sm mt-1.5 font-medium bg-red-500/10 inline-block px-3 py-1 rounded-lg">Reason: {rejectionReason}</p>}
        <p className="text-red-800/70 text-sm mt-2 leading-relaxed">Please update your information and documents, then resubmit for review.</p>
      </div>
      <div className="absolute -right-4 -top-4 opacity-[0.03] transform rotate-12 scale-150"><AlertCircle className="w-32 h-32 text-red-900" /></div>
    </div>
  );
  return null;
}

// ── Document Card ─────────────────────────────────────────────────────────
function DocCard({ docType, uploadedDoc, isReadOnly, uploading, onUpload, onDelete }: any) {
  const [dragOver, setDragOver] = useState(false);
  const colors = ACCENTS[docType.accent];
  const isUploading = uploading === docType.type;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (isReadOnly || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    const input = document.createElement("input");
    input.files = dt.files;
    onUpload({ target: input } as any, docType.type);
  }, [isReadOnly, isUploading, docType.type, onUpload]);

  return (
    <div
      className={`group relative rounded-3xl border-2 transition-all duration-500 overflow-hidden ${colors.glow}
        ${uploadedDoc ? `${colors.border} ${colors.bg}` : dragOver && !isReadOnly ? "border-blue-400 bg-blue-50/50 scale-[1.02]" : "border-dashed border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50/80"}`}
      onDragOver={(e) => { e.preventDefault(); if (!isReadOnly) setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="p-6 flex flex-col items-center text-center gap-4 min-h-[220px] justify-center relative z-10">
        {uploadedDoc ? (
          <>
            <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center animate-pop-in`}><CheckCircle2 className={`w-7 h-7 ${colors.text}`} /></div>
            <div>
              <p className={`font-bold text-[15px] ${colors.text}`}>{docType.label}</p>
              <p className="text-[13px] text-slate-500 mt-1.5 line-clamp-2 max-w-[180px]" title={uploadedDoc.originalFileName}>{uploadedDoc.originalFileName}</p>
            </div>
            {!isReadOnly && (
              <button type="button" onClick={() => onDelete(uploadedDoc.id)} className="flex items-center gap-1.5 text-[13px] font-semibold text-red-500 hover:text-red-700 transition-colors px-4 py-2 rounded-xl hover:bg-red-50 mt-1">
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            )}
            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              {isUploading ? <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" /> : <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />}
            </div>
            <div>
              <p className="font-bold text-[15px] text-slate-800">{docType.label}</p>
              <p className="text-[12px] text-slate-500 mt-1.5 leading-relaxed px-2">{docType.desc}</p>
            </div>
            {!isReadOnly && (
              <label className="mt-2 cursor-pointer">
                <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300
                  ${isUploading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"}`}>
                  {isUploading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading...</> : <><UploadCloud className="w-4 h-4" /> Choose File</>}
                </span>
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onUpload(e, docType.type)} disabled={uploading !== null} />
              </label>
            )}
          </>
        )}
      </div>
      {/* Subtle background gradient blob for un-uploaded state hover */}
      {!uploadedDoc && !isReadOnly && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/0 group-hover:to-blue-500/5 transition-colors duration-500 pointer-events-none" />
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function SellerKyc() {
  const { data, isLoading, submitKyc, uploadDocument, deleteDocument, lookupCompany } = useSellerKyc();

  const [legalName, setLegalName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  React.useEffect(() => {
    if (data && data.status !== "NOT_STARTED") {
      if (data.legalName) setLegalName(data.legalName);
      if (data.businessAddress) setBusinessAddress(data.businessAddress);
      if (data.phone) setPhone(data.phone);
      if (data.companyNumber) setCompanyNumber(data.companyNumber);
    }
  }, [data]);

  const showToast = (msg: string, type: "success" | "error") => setToast({ msg, type });

  const handleLookup = async () => {
    if (!companyNumber.trim()) return;
    try {
      setLookupLoading(true);
      const res = await lookupCompany(companyNumber.trim());
      setLegalName(res.company_name || "");
      const addr = res.registered_office_address;
      if (addr) setBusinessAddress([addr.address_line_1, addr.locality, addr.postal_code].filter(Boolean).join(", "));
      showToast("Company details found and populated!", "success");
    } catch {
      showToast("Company lookup failed. Please enter details manually.", "error");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { showToast("File too large. Maximum size is 10 MB.", "error"); return; }
    try {
      setUploading(type);
      await uploadDocument(file, type);
      showToast("Document uploaded successfully!", "success");
    } catch (err: any) {
      showToast("Upload failed: " + (err?.message || "Unknown error"), "error");
    } finally {
      setUploading(null);
      if (e.target) e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    try { await deleteDocument(id); showToast("Document removed.", "success"); }
    catch { showToast("Failed to remove document.", "error"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName.trim() || !businessAddress.trim()) { showToast("Please fill in all required fields.", "error"); return; }
    try {
      setSubmitting(true);
      await submitKyc({ legalName, businessAddress, phone, companyNumber });
      showToast("KYC submitted! We will review it within 1-2 business days.", "success");
    } catch (err: any) {
      showToast("Submission failed: " + (err?.message || "Unknown error"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-fade-in">
        <div className="h-10 w-72 bg-slate-200/50 rounded-2xl animate-pulse" />
        <div className="h-5 w-96 bg-slate-100/50 rounded-xl animate-pulse" />
        <div className="h-48 bg-slate-50/50 rounded-3xl border border-slate-100 animate-pulse" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-16 bg-slate-50/50 rounded-2xl border border-slate-100 animate-pulse" />
          <div className="h-16 bg-slate-50/50 rounded-2xl border border-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  const isPending = data?.status === "PENDING" && !!data?.submittedAt;
  const isApproved = data?.status === "APPROVED";
  const isReadOnly = isPending || isApproved;
  const uploadedDocs = data?.documents ?? [];
  const allDocsUploaded = DOC_TYPES.every(dt => uploadedDocs.some(d => d.documentType === dt.type));

  const steps = [
    { label: "Business Info", done: !!(legalName && businessAddress) },
    { label: "Documents",     done: allDocsUploaded },
    { label: "Review",        done: isApproved },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-10 pb-20 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Business Verification</h1>
          </div>
          <p className="text-[16px] text-slate-500 ml-[64px]">Complete KYC to start listing premium businesses on INFYBUYS.</p>
        </div>
        {data?.status && data.status !== "NOT_STARTED" && (
          <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[14px] font-bold border self-start sm:self-auto shadow-sm transition-all duration-300 hover:scale-105
            ${isApproved ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : isPending ? "bg-amber-50 border-amber-200 text-amber-700"
              : "bg-red-50 border-red-200 text-red-700"}`}>
            {isApproved && <><CheckCircle2 className="w-4 h-4" /> Approved</>}
            {isPending && <><Clock className="w-4 h-4" /> Under Review</>}
            {data.status === "REJECTED" && <><XCircle className="w-4 h-4" /> Rejected</>}
          </div>
        )}
      </div>

      {/* Progress steps (Premium Look) */}
      <div className="flex items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm max-w-2xl">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className="flex items-center gap-3 flex-shrink-0 group">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[13px] font-bold transition-all duration-500
                ${step.done ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}>
                {step.done ? <CheckCircle2 className="w-5 h-5 animate-pop-in" /> : i + 1}
              </div>
              <span className={`text-[14px] font-semibold hidden sm:block transition-colors duration-300 ${step.done ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full transition-all duration-1000 ease-out ${step.done ? "bg-blue-600 w-full" : "w-0 bg-blue-600"}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Status Banner */}
      {data?.status && data.status !== "NOT_STARTED" && (
        <div className="animate-slide-up">
          <StatusBanner status={data.status} rejectionReason={data.rejectionReason} />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Business Info Card */}
        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="w-10 h-10 rounded-2xl bg-blue-100/50 flex items-center justify-center"><Building2 className="w-5 h-5 text-blue-600" /></div>
            <div>
              <h2 className="font-bold text-[18px] text-slate-900">Business Information</h2>
              <p className="text-[14px] text-slate-500 mt-0.5">Enter your registered business details as they appear on official documents.</p>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Company lookup */}
            <div className="space-y-3 max-w-2xl">
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                Company Registration Number
                <span className="text-[11px] font-medium text-slate-400 normal-case tracking-normal ml-1 bg-slate-100 px-2 py-0.5 rounded-md">Optional</span>
              </label>
              <div className="flex gap-4">
                <input type="text" value={companyNumber} onChange={(e) => setCompanyNumber(e.target.value)} disabled={isReadOnly}
                  className={inputCls(isReadOnly) + " flex-1 text-lg"} placeholder="e.g. 12345678"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleLookup(); } }} />
                {!isReadOnly && (
                  <button type="button" onClick={handleLookup} disabled={lookupLoading || !companyNumber.trim()}
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-[15px] bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex-shrink-0 transition-all duration-300">
                    {lookupLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    {lookupLoading ? "Searching..." : "Auto-fill"}
                  </button>
                )}
              </div>
              {!isReadOnly && (
                <p className="text-[13px] text-slate-500 flex items-center gap-2 mt-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Enter your Companies House number to auto-fill the details below.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-slate-400" /> Legal Business Name <span className="text-red-500">*</span>
                </label>
                <input type="text" required value={legalName} onChange={(e) => setLegalName(e.target.value)} disabled={isReadOnly}
                  className={inputCls(isReadOnly)} placeholder="As registered with Companies House" />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-slate-400" /> Business Phone
                </label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isReadOnly}
                  className={inputCls(isReadOnly)} placeholder="+44 20 1234 5678" />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-slate-400" /> Registered Business Address <span className="text-red-500">*</span>
                </label>
                <input type="text" required value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} disabled={isReadOnly}
                  className={inputCls(isReadOnly)} placeholder="123 Business Street, London, EC1A 1AA" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-100/50 flex items-center justify-center"><FileText className="w-5 h-5 text-purple-600" /></div>
              <div>
                <h2 className="font-bold text-[18px] text-slate-900">Verification Documents</h2>
                <p className="text-[14px] text-slate-500 mt-0.5">Upload clear, color copies of the required documents below.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className={`text-[15px] font-extrabold ${uploadedDocs.length === DOC_TYPES.length ? "text-emerald-600" : "text-blue-600"}`}>{uploadedDocs.length}</span>
              <span className="text-slate-300">/</span>
              <span className="text-[14px] font-medium text-slate-500">{DOC_TYPES.length} Uploaded</span>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DOC_TYPES.map((docType) => (
                <DocCard key={docType.type} docType={docType}
                  uploadedDoc={uploadedDocs.find((d: any) => d.documentType === docType.type)}
                  isReadOnly={isReadOnly} uploading={uploading} onUpload={handleUpload} onDelete={handleDelete} />
              ))}
            </div>
            {!isReadOnly && (
              <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center gap-3 text-[13px] text-slate-500 font-medium">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                Accepted formats: PDF, JPG, PNG (Max 10 MB each). You can also drag and drop files onto the cards above.
              </div>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        {!isReadOnly && (
          <div className="relative overflow-hidden rounded-[2rem] border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/50 shadow-lg shadow-blue-900/5 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            <div className="relative z-10 text-center sm:text-left">
              <p className="font-extrabold text-[18px] text-blue-950">Ready to submit?</p>
              <p className="text-[14px] text-blue-800/80 mt-1">Make sure all information is accurate and documents are clear before submitting.</p>
            </div>
            <button type="submit" disabled={!legalName.trim() || !businessAddress.trim() || submitting || !allDocsUploaded}
              className="relative z-10 flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[16px] transition-all duration-300
                bg-blue-600 text-white shadow-xl shadow-blue-500/30
                hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-1 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:hover:bg-blue-600">
              {submitting
                ? <><RefreshCw className="w-5 h-5 animate-spin" /> Submitting securely...</>
                : <><ShieldCheck className="w-5 h-5" /> Submit for Verification <ArrowRight className="w-5 h-5" /></>}
            </button>
          </div>
        )}
      </form>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
